import { LexResult, Tokens } from '../types';

import { SPECIAL_CHARACTERS, OPERATORS, DELIMITERS } from './const';
import { findNextMatch } from './utils';

const specialCharArray = Object.keys(SPECIAL_CHARACTERS);

export const lex = (expression: string): LexResult => {
  const nextCharIndex = findNextMatch(expression, DELIMITERS, false);

  // Throws error if there are no tokens in the expression
  if (expression.length === nextCharIndex) {
    // Will return EOF here
    return {
      token: {
        name: Tokens.EOF,
      },
      remainingString: '',
    };
  }

  // If the first character is a special character then it becomes a token
  if (SPECIAL_CHARACTERS[expression[nextCharIndex]]) {
    return {
      token: {
        name: Tokens.SPECIAL_CHARACTER,
        value: SPECIAL_CHARACTERS[expression[nextCharIndex]],
      },
      remainingString: expression.slice(nextCharIndex + 1),
    };
  }

  // Finds the next delimiter or special character
  const nextDelimiterIndex =
    findNextMatch(expression.slice(nextCharIndex), [
      ...DELIMITERS,
      ...specialCharArray,
    ]) + nextCharIndex;

  // Splits expression into token and remaining string
  const value = expression.slice(nextCharIndex, nextDelimiterIndex);
  const remainingString = expression.slice(nextDelimiterIndex);

  const operator = OPERATORS[value];

  if (operator) {
    return {
      token: {
        name: Tokens.OPERATOR,
        value: operator,
      },
      remainingString,
    };
  }

  // Returns the LexResult
  return {
    token: {
      name: Tokens.IDENTIFIER,
      value,
    },
    remainingString,
  };
};
