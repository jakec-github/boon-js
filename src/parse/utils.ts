import {
  Tokens,
  TokenSet,
  ParsedExpression,
  Operators,
  ParsedOperator,
} from '../types';

import { OPERATOR_PRECEDENCE } from './const';

export const getPathToLastValue = ({ value }: ParsedExpression): string[] => {
  if (typeof value === 'string') {
    return ['value'];
  } else {
    return ['value', 'right', ...getPathToLastValue(value.right)];
  }
};

export const previousOperatorTakesPrecedent = (
  previousOperator: Operators,
  nextOperator: Operators,
): Boolean =>
  OPERATOR_PRECEDENCE[previousOperator] <= OPERATOR_PRECEDENCE[nextOperator];

// This isn't super safe. Need to imrpove types
export const resolvePath = (expression: any, path: string[]): any =>
  path.reduce((acc, key) => acc[key], expression);

export const validateToken = (
  token: Tokens,
  expectedTokenSet: TokenSet,
): void => {
  if (!expectedTokenSet.has(token)) {
    throw new TypeError('Invalid token');
  }
};
