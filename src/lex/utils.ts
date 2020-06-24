import { Token, LexResult, Tokens } from '../types';

import { STRUCTURAL_CHARACTERS, SEPARATORS } from './const';

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

const QUOTATION = '"';
const ESCAPE = '\\';
const EOL = String.fromCodePoint(0x000a);

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
    const letter = expression[i];

    if (tokenEnd === null) {
      if (letter === QUOTATION) {
        if (escapeQuotation) {
          value = value.slice(-1) + QUOTATION;
        } else {
          tokenEnd = i;
        }
      } else {
        if (letter === ESCAPE) {
          escapeQuotation = true;
        } else {
          escapeQuotation = false;
        }
        value = value += letter;
      }
    } else {
      if (!SEPARATORS.has(letter) && !STRUCTURAL_CHARACTERS[letter]) {
        throw new Error(
          `Unexpected character: ${letter} Expected ( character or separator`,
        );
      }
      break;
    }
  }

  if (tokenEnd === null) {
    throw new Error(
      `Unexpected end of expression: expected ${QUOTATION} character`,
    );
  }

  return createResult(Tokens.IDENTIFIER, value, expression.slice(tokenEnd + 1));
};
