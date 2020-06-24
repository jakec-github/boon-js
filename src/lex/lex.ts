import { LexResult, Tokens } from '../types';

import {
  STRUCTURAL_CHARACTERS,
  OPERATORS,
  SEPARATORS,
  QUOTED_IDENTIFIER_DELIMITER,
  COMMENT_DELIMITER,
} from './const';
import { createResult, getComment, getQuotedIdentifier } from './utils';

export const lex = (expression: string): LexResult => {
  let tokenStart: number = null;
  let tokenEnd: number = null;

  // Loops through characters in the expression until the next token is found
  for (let i = 0; i < expression.length; i += 1) {
    const letter = expression[i];

    // Finds tokem start and returns immediately returns any identifiable tokens
    if (tokenStart === null) {
      if (!SEPARATORS.has(letter)) {
        if (STRUCTURAL_CHARACTERS[letter]) {
          return createResult(
            Tokens.STRUCTURAL_CHARACTER,
            STRUCTURAL_CHARACTERS[letter],
            expression.slice(i + 1),
          );
        }
        // Once a quoted identifier has been identified it is retrieved in a separate function
        if (letter === QUOTED_IDENTIFIER_DELIMITER) {
          return getQuotedIdentifier(expression.slice(i + 1));
        }
        // Once a comment has been identified it is retrieved in a separate function
        if (letter === COMMENT_DELIMITER) {
          return getComment(expression.slice(i + 1));
        }
        tokenStart = i;
      }
    } else {
      // Breaks on the end of the token and throws on invalid characters
      if (SEPARATORS.has(letter) || STRUCTURAL_CHARACTERS[letter]) {
        tokenEnd = i;
        break;
      } else {
        if (
          letter === QUOTED_IDENTIFIER_DELIMITER ||
          letter === COMMENT_DELIMITER
        ) {
          throw new Error(`Unexpected character: ${letter}`);
        }
      }
    }
  }
  // Separates operators from identifiers and returns the correct token
  if (tokenStart !== null) {
    tokenEnd = tokenEnd ?? expression.length;

    const value = expression.slice(tokenStart, tokenEnd);
    const remainingString = expression.slice(tokenEnd);

    if (OPERATORS[value]) {
      return createResult(Tokens.OPERATOR, OPERATORS[value], remainingString);
    } else {
      return createResult(Tokens.IDENTIFIER, value, remainingString);
    }
  }

  // If this is reached no tokens were found so EOF is returned
  return createResult(Tokens.EOF, null, '');
};
