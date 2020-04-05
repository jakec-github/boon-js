import {
  Tokens,
  TokenSet,
  ParsedExpression,
  Operators,
  ParsedOperator,
} from '../types';

import { OPERATOR_PRECEDENCE } from './const';

export const getPreviousValues = ({
  value,
}: ParsedExpression): ParsedOperator[] =>
  typeof value === 'string' ? [] : [...getPreviousValues(value.right), value];

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
