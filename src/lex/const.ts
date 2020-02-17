import { Tokens } from '../types';

export const RESERVED_WORDS: Record<string, Tokens> = {
  AND: Tokens.OPERATOR,
  OR: Tokens.OPERATOR,
  XOR: Tokens.OPERATOR,
  NOT: Tokens.NEGATION,
};

export const SPECIAL_CHARACTERS: Record<string, Tokens> = {
  '(': Tokens.OPEN_PARENTHESIS,
  ')': Tokens.CLOSE_PARENTHESIS,
};

export const DELIMITERS = new Set([' ', '\n']);
