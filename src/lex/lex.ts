import { PROJECT_NAME } from '../const';
import { LexResult, Tokens } from '../types';

import { RESERVED_WORDS, SPECIAL_CHARACTERS, OPERATORS } from './const';
import { findNextDelimiter } from './utils';

export const lex = (expression: string): LexResult => {
  const trimmedExpression = expression.trim();

  // Throws error if there are no tokens in the expression
  if (trimmedExpression.length === 0) {
    throw new Error(`Invalid ${PROJECT_NAME}: No tokens found`);
  }

  // If the first character is a special character then it becomes a token
  if (SPECIAL_CHARACTERS[trimmedExpression[0]]) {
    return {
      token: {
        type: SPECIAL_CHARACTERS[trimmedExpression[0]],
      },
      remainingString: trimmedExpression.slice(1),
    };
  }

  // Finds the next delimiter or special character
  const nextDelimiterIndex = findNextDelimiter(trimmedExpression);

  // Splits expression into token and remaining string
  const value = trimmedExpression.slice(0, nextDelimiterIndex);
  const remainingString = trimmedExpression.slice(nextDelimiterIndex);

  const reservedWordType = RESERVED_WORDS[value];

  if (reservedWordType === Tokens.NEGATION) {
    return {
      token: {
        type: Tokens.NEGATION,
      },
      remainingString,
    };
  }

  if (reservedWordType) {
    return {
      token: {
        type: Tokens.OPERATOR,
        subType: OPERATORS[value],
      },
      remainingString,
    };
  }

  // Returns the LexResult
  return {
    token: {
      type: Tokens.VARIABLE,
      value,
    },
    remainingString,
  };
};
