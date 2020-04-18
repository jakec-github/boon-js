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

export type GetNextToken = (expectedTokenSet: TokenSets) => Token;

export const newTokenGenerator = (expression: string): GetNextToken => {
  let remainingExpression = expression;

  return (expectedTokenSet) => {
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;

    validateToken(token, expectedTokenSet);

    return token;
  };
};

export const getValue = (
  getNextToken: GetNextToken,
  parser: (getNextToken: GetNextToken, nested: boolean) => PostfixExpression,
): PostfixExpression => {
  let nextToken = getNextToken(TokenSets.OPERAND_OR_NOT);
  let negatedValue = nextToken.value === Operators.NOT;
  if (negatedValue) {
    nextToken = getNextToken(TokenSets.OPERAND);
  }

  const value: PostfixExpression =
    nextToken.name === Tokens.SPECIAL_CHARACTER
      ? parser(getNextToken, true)
      : [nextToken];

  return negatedValue
    ? [...value, { name: Tokens.OPERATOR, value: Operators.NOT }]
    : value;
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
    if (token.name === Tokens.EOF) {
      throw new Error('Unexpected end of expression');
    } else {
      if (
        token.name === Tokens.OPERAND ||
        ('value' in token && token.value === SpecialCharacters.OPEN_PARENTHESIS)
      ) {
        return;
      }
      if (
        expectedTokens === TokenSets.OPERAND_OR_NOT &&
        'value' in token &&
        token.value === Operators.NOT
      ) {
        return;
      }
    }
  } else {
    if (
      token.name === Tokens.OPERATOR &&
      'value' in token &&
      token.value !== Operators.NOT
    ) {
      return;
    }
    if (token.name === Tokens.EOF) {
      return;
    }
    if (
      expectedTokens === TokenSets.OPERATOR_OR_CLOSE &&
      'value' in token &&
      token.value === SpecialCharacters.CLOSE_PARENTHESIS
    ) {
      return;
    }
  }
  throw new TypeError('Invalid token');
};
