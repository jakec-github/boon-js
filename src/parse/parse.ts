import { PostfixExpression, Tokens, Operators } from '../types';

import { VALID_TOKENS } from './const';
import {
  addOperatorsToOutput,
  previousOperatorTakesPrecedent,
  newTokenGenerator,
  GetNextToken,
  getValue,
} from './utils';

// Returns the tokens using postfix notation
export const parse = (expression: string): PostfixExpression => {
  if (typeof expression !== 'string') {
    throw new Error(`Expected string but received ${typeof expression}`);
  }

  // getNextToken keeps track of the remaining expression
  // and return the next token each time it is called
  const getNextToken = newTokenGenerator(expression);

  return parseInternal(getNextToken);
};

// parseInternal will recurse over bracketed expressions
const parseInternal = (
  getNextToken: GetNextToken,
  nested = false,
): PostfixExpression => {
  // This initialises the output with everything up the first unnested operator
  let output: PostfixExpression = [...getValue(getNextToken, parseInternal)];
  let operators: PostfixExpression = [];

  while (true) {
    const validTokens = nested
      ? VALID_TOKENS.binaryOperatorOrClose
      : VALID_TOKENS.binaryOperator;

    // Retrieves the next Token
    const nextToken = getNextToken(validTokens, true);

    // If the end of file is found here then return what we have
    if (nextToken.name === Tokens.EOF) {
      return addOperatorsToOutput(output, operators);
    }

    // This indicates a close parenthesis has been found
    // The expression will be returned and incorporated into the final expression
    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      return addOperatorsToOutput(output, operators);
    }

    // In postfix notation operator order is determined by precedence
    const previousOperator = operators[operators.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(
        previousOperator.value as Operators,
        nextToken.value as Operators,
      )
    ) {
      output = addOperatorsToOutput(output, operators);
      operators = [];
    }

    // The new operator is now added to the stack
    operators = [...operators, nextToken];

    // Once this is done we can get everything until the next unnested
    // operator and add it to the output
    output = [...output, ...getValue(getNextToken, parseInternal)];
  }
};
