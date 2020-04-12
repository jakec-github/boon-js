import { lex } from '../lex/lex';
import {
  TokenSets,
  Token,
  PostfixExpression,
  OperatorStack,
  OperatorToken,
  Operators,
} from '../types';

import {
  addOperatorsToOutput,
  previousOperatorTakesPrecedent,
  validateToken,
} from './utils';

export const parse = (expression: string): PostfixExpression => {
  let remainingExpression = expression;

  // This should be a generic for full type safety
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
  const getValue = (): PostfixExpression => {
    const nextToken = getNextToken(TokenSets.OPERAND_OR_NOT);

    if (nextToken.value === Operators.NOT) {
      return [getNextToken(TokenSets.OPERAND), nextToken];
    }
    return [nextToken];
  };

  // This type casting should be solvable using a generic
  const getOperator = (): OperatorToken =>
    getNextToken(TokenSets.OPERATOR) as OperatorToken;

  let output: PostfixExpression = [...getValue()];
  let operators: OperatorStack = [];

  while (remainingExpression) {
    const nextOperator = getOperator();
    const previousOperator = operators[operators.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(previousOperator.value, nextOperator.value)
    ) {
      [output, operators] = addOperatorsToOutput(output, operators);
    }
    operators = [...operators, nextOperator];
    output = [...output, ...getValue()];
  }

  [output, operators] = addOperatorsToOutput(output, operators);

  return output;
};
