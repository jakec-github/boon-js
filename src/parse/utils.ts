import {
  Token,
  Tokens,
  TokenSets,
  Operators,
  PostfixExpression,
  OperatorStack,
  OperatorToken,
  SpecialCharacters,
} from '../types';

import { OPERATOR_PRECEDENCE } from './const';

export const addOperatorsToOutput = (
  output: PostfixExpression,
  operators: OperatorStack,
): [PostfixExpression, OperatorStack] => [
  [
    ...output,
    ...operators.reduceRight<OperatorStack>(
      (acc, operator: OperatorToken) => [...acc, operator],
      [],
    ),
  ],
  [],
];

export const previousOperatorTakesPrecedent = (
  previousOperator: Operators,
  nextOperator: Operators,
): Boolean =>
  OPERATOR_PRECEDENCE[previousOperator] <= OPERATOR_PRECEDENCE[nextOperator];

export const validateToken = (
  token: Token,
  expectedTokens: TokenSets,
): void => {
  if (
    expectedTokens === TokenSets.OPERAND ||
    expectedTokens === TokenSets.OPERAND_OR_NOT
  ) {
    if (
      token.name === Tokens.OPERAND ||
      token.value === SpecialCharacters.OPEN_PARENTHESIS
    ) {
      return;
    }
    if (
      expectedTokens === TokenSets.OPERAND_OR_NOT &&
      token.value === Operators.NOT
    ) {
      return;
    }
  } else {
    if (token.name === Tokens.OPERATOR && token.value !== Operators.NOT) {
      return;
    }
    if (
      expectedTokens === TokenSets.OPERATOR_OR_CLOSE &&
      token.value === SpecialCharacters.CLOSE_PARENTHESIS
    ) {
      return;
    }
  }
  throw new TypeError('Invalid token');
};
