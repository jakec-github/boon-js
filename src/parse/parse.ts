import { PostfixExpression, Tokens, Operators } from '../types';

import { VALID_TOKENS } from './const';
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
  let operators: PostfixExpression = [];

  while (true) {
    const validTokens = nested
      ? VALID_TOKENS.binaryOperatorOrClose
      : VALID_TOKENS.binaryOperator;
    const nextToken = getNextToken(validTokens, true);
    if (nextToken.name === Tokens.EOF) {
      break;
    }

    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      [output, operators] = addOperatorsToOutput(output, operators);
      return output;
    }
    const nextOperator = nextToken;

    const previousOperator = operators[operators.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(
        previousOperator.value as Operators,
        nextOperator.value as Operators,
      )
    ) {
      [output, operators] = addOperatorsToOutput(output, operators);
    }
    operators = [...operators, nextOperator];
    output = [...output, ...getValue(getNextToken, parseInternal)];
  }

  [output, operators] = addOperatorsToOutput(output, operators);
  return output;
};
