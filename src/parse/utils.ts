import { Token, Tokens, TokenSets, Operators } from '../types';

import { OPERATOR_PRECEDENCE } from './const';

export const previousOperatorTakesPrecedent = (
  previousOperator: Operators,
  nextOperator: Operators,
): Boolean =>
  OPERATOR_PRECEDENCE[previousOperator] <= OPERATOR_PRECEDENCE[nextOperator];

export const validateToken = (
  token: Token,
  expectedTokens: TokenSets,
): void => {
  switch (expectedTokens) {
    case TokenSets.OPERAND:
      // This case needs fleshing out to handle NOT and ()
      if (token.name === Tokens.OPERAND) {
        return;
      }
    case TokenSets.OPERATOR:
      if (token.name === Tokens.OPERATOR && token.value !== Operators.NOT) {
        return;
      }
  }
  throw new TypeError('Invalid token');
};
