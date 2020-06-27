import { Token, LexResult, Tokens } from '../types';

import {
  STRUCTURAL_CHARACTERS,
  SEPARATORS,
  QUOTED_IDENTIFIER_DELIMITER,
  EOL,
  ESCAPE_CHARACTER,
} from './const';

export const createResult = (
  name: Token['name'],
  value: Token['value'],
  remainingString: string,
): LexResult => ({
  token: {
    name,
    ...(value !== null ? { value } : {}),
  },
  remainingString,
});

export const getComment = (expression: string): LexResult => {
  let tokenEnd = expression.length;

  for (let i = 0; i < expression.length; i += 1) {
    const letter = expression[i];

    if (letter === EOL) {
      tokenEnd = i;
      break;
    }
  }

  return createResult(
    Tokens.COMMENT,
    expression.slice(0, tokenEnd),
    expression.slice(tokenEnd + 1),
  );
};

export const getQuotedIdentifier = (expression: string): LexResult => {
  let escapeQuotation = false;
  let value = '';
  let tokenEnd = null;

  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];

    if (tokenEnd === null) {
      if (char === QUOTED_IDENTIFIER_DELIMITER) {
        if (escapeQuotation) {
          value = value.slice(-1) + QUOTED_IDENTIFIER_DELIMITER;
        } else {
          tokenEnd = i;
        }
      } else {
        if (char === ESCAPE_CHARACTER) {
          escapeQuotation = true;
        } else {
          escapeQuotation = false;
        }
        value = value += char;
      }
    } else {
      if (!SEPARATORS.has(char) && !STRUCTURAL_CHARACTERS[char]) {
        throw new Error(
          `Unexpected character: ${char} Expected ( character or separator`,
        );
      }
      break;
    }
  }

  if (tokenEnd === null) {
    throw new Error(
      `Unexpected end of expression: expected ${QUOTED_IDENTIFIER_DELIMITER} character`,
    );
  }

  return createResult(Tokens.IDENTIFIER, value, expression.slice(tokenEnd + 1));
};
