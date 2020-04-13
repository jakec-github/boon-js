import { lex } from '../lex/lex';
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

// This should be a generic for full type safety
export const getNextToken = (
  expectedTokenSet: TokenSets,
  remainingExpression: string,
): [Token, string] => {
  if (!remainingExpression) {
    throw new Error('Unexpected end of expression');
  }
  const { token, remainingString } = lex(remainingExpression);

  validateToken(token, expectedTokenSet);

  return [token, remainingString];
};

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
