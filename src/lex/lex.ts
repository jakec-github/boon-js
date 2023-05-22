import { LexResult, StructuralCharacters, Tokens } from '../types';

import {
  STRUCTURAL_CHARACTERS,
  OPERATORS,
  SEPARATORS,
  QUOTED_IDENTIFIER_DELIMITER,
  COMMENT_DELIMITER
} from './const';
import { createResult, getComment, getQuotedIdentifier } from './utils';

export const lex = (expression: string): LexResult => {
  let tokenStart: number = null;
  let tokenEnd: number = null;
  let delimitingCharacter = null;

  // Loops through characters in the expression until the next token is found
  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];

    // Finds token start and returns immediately returns any identifiable tokens
    if (tokenStart === null) {
      if (!SEPARATORS.has(char)) {
        const structuralChar = STRUCTURAL_CHARACTERS[char];

        if (structuralChar) {
          const nextChar = expression[i + 1];
          if (
            structuralChar === StructuralCharacters.CLOSE_PARENTHESIS &&
            nextChar &&
            !SEPARATORS.has(nextChar) &&
            nextChar !== StructuralCharacters.CLOSE_PARENTHESIS
          ) {
            throw new Error(
              `Unexpected character: ${nextChar}. A closing parenthesis should be followed by another closing parenthesis or whitespace`
            );
          }

          return createResult(
            Tokens.STRUCTURAL_CHARACTER,
            STRUCTURAL_CHARACTERS[char],
            expression.slice(i + 1)
          );
        }
        // Once a quoted identifier has been identified it is retrieved in a separate function
        if (char === QUOTED_IDENTIFIER_DELIMITER) {
          return getQuotedIdentifier(expression.slice(i + 1));
        }
        // Once a comment has been identified it is retrieved in a separate function
        if (char === COMMENT_DELIMITER) {
          return getComment(expression.slice(i + 1));
        }
        tokenStart = i;
      }
    } else {
      // Breaks on the end of the token and throws on invalid characters
      if (SEPARATORS.has(char) || STRUCTURAL_CHARACTERS[char]) {
        tokenEnd = i;
        delimitingCharacter = char;
        break;
      } else {
        if (
          char === QUOTED_IDENTIFIER_DELIMITER ||
          char === COMMENT_DELIMITER
        ) {
          throw new Error(`Unexpected character: ${char}`);
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
      if (delimitingCharacter && !SEPARATORS.has(delimitingCharacter)) {
        throw new Error(
          `Unexpected character: ${delimitingCharacter}. Operators should be separated using whitespace`
        );
      }
      return createResult(Tokens.OPERATOR, OPERATORS[value], remainingString);
    } else {
      return createResult(Tokens.IDENTIFIER, value, remainingString);
    }
  }

  // If this is reached no tokens were found so EOF is returned
  return createResult(Tokens.EOF, null, '');
};
