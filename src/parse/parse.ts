import {
  TokenSets,
  PostfixExpression,
  OperatorStack,
  OperatorToken,
  Tokens,
} from '../types';

import {
  addOperatorsToOutput,
  previousOperatorTakesPrecedent,
  newTokenGenerator,
  GetNextToken,
  getValue,
} from './utils';

export const parse = (expression: string): PostfixExpression => {
  if (typeof expression !== 'string') {
    throw new Error(`Expected string but received ${typeof expression}`);
  }

  const getNextToken = newTokenGenerator(expression);

  return parseInternal(getNextToken);
};

const parseInternal = (
  getNextToken: GetNextToken,
  nested = false,
): PostfixExpression => {
  let output: PostfixExpression = [...getValue(getNextToken, parseInternal)];
  let operators: OperatorStack = [];

  while (true) {
    const tokenSet = nested ? TokenSets.OPERATOR_OR_CLOSE : TokenSets.OPERATOR;
    const nextToken = getNextToken(tokenSet);
    if (nextToken.name === Tokens.EOF) {
      break;
    }

    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      [output, operators] = addOperatorsToOutput(output, operators);
      return output;
    }
    // This type casting should be solvable using a generic
    const nextOperator = nextToken as OperatorToken;

    const previousOperator = operators[operators.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(previousOperator.value, nextOperator.value)
    ) {
      [output, operators] = addOperatorsToOutput(output, operators);
    }
    operators = [...operators, nextOperator];
    output = [...output, ...getValue(getNextToken, parseInternal)];
  }

  [output, operators] = addOperatorsToOutput(output, operators);
  return output;
};
