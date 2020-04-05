import {
  Tokens,
  TokenSet,
  ParsedExpression,
  ExpressionValue,
  Operators,
} from '../types';

import { OPERATOR_PRECEDENCE } from './const';

export const getPreviousValues = ({
  value,
}: ParsedExpression): ExpressionValue[] =>
  typeof value === 'string'
    ? [value]
    : [...getPreviousValues(value.right), value];

export const previousOperatorTakesPrecedent = (
  previousOperator: Operators,
  nextOperator: Operators,
): Boolean =>
  OPERATOR_PRECEDENCE[previousOperator] <= OPERATOR_PRECEDENCE[nextOperator];

export const validateToken = (
  token: Tokens,
  expectedTokenSet: TokenSet,
): void => {
  if (!expectedTokenSet.has(token)) {
    throw new TypeError('Invalid token');
  }
};
