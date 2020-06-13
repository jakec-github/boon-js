import { lex } from '../lex/lex';
import { Token, Tokens, Operators, PostfixExpression } from '../types';

import { OPERATOR_PRECEDENCE, VALID_TOKENS } from './const';

export const addOperatorsToOutput = (
  output: PostfixExpression,
  operators: PostfixExpression,
): PostfixExpression => [
  ...output,
  ...operators.reduce<PostfixExpression>(
    (acc, operator) => [operator, ...acc],
    [],
  ),
];

export type GetNextToken = (
  validTokens: Token[],
  endIsValid?: boolean,
) => Token;

export const newTokenGenerator = (expression: string): GetNextToken => {
  let remainingExpression = expression;

  return (validTokens, endIsValid = false) => {
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;

    validateToken(token, validTokens, endIsValid);

    return token;
  };
};

export const getValue = (
  getNextToken: GetNextToken,
  parser: (getNextToken: GetNextToken, nested: boolean) => PostfixExpression,
): PostfixExpression => {
  let nextToken = getNextToken(VALID_TOKENS.identifierOrNot);
  let negatedValue = nextToken.value === Operators.NOT;
  if (negatedValue) {
    nextToken = getNextToken(VALID_TOKENS.identifierOnly);
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
  validTokens: Token[],
  endIsValid = false,
) => {
  if (token.name === Tokens.EOF) {
    if (endIsValid) {
      return;
    }
    throw new Error('Unexpected end of expression');
  }

  for (let validToken of validTokens) {
    if (validToken.name === token.name) {
      if (!validToken.value || validToken.value === token.value) {
        return;
      }
    }
  }

  throw new TypeError('Invalid token');
};
