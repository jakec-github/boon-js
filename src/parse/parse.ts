import { lex } from '../lex/lex';
import {
  TokenSets,
  Token,
  PostfixExpression,
  OperatorStack,
  OperatorToken,
} from '../types';

import { validateToken, previousOperatorTakesPrecedent } from './utils';

export const parse = (expression: string): PostfixExpression => {
  let remainingExpression = expression;

  // Ideally this should be a generic for full type safety
  const getNextToken = (expectedTokenSet: TokenSets): Token => {
    if (!remainingExpression) {
      throw new Error('Unexpected end of expression');
    }
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;

    validateToken(token, expectedTokenSet);

    return token;
  };

  // This will later handle potential parentheses and negations
  const getValue = (): PostfixExpression => [getNextToken(TokenSets.OPERAND)];

  // This type casting should be solvable when types are sorted using a generic
  const getOperator = (): OperatorToken =>
    getNextToken(TokenSets.OPERATOR) as OperatorToken;

  let outputStack: PostfixExpression = [...getValue()];
  let operatorStack: OperatorStack = [];

  while (remainingExpression) {
    const nextOperator = getOperator();
    const previousOperator = operatorStack[operatorStack.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(previousOperator.value, nextOperator.value)
    ) {
      outputStack = [...outputStack, ...operatorStack.reverse()]; // Disgusting mutating method
      operatorStack = [];
    }
    operatorStack = [...operatorStack, nextOperator];
    outputStack = [...outputStack, ...getValue()];
  }

  outputStack = [...outputStack, ...operatorStack.reverse()]; // Disgusting mutating method

  return outputStack;
};
