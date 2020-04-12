import { Operators, SpecialCharacters } from '../types';

export const SPECIAL_CHARACTERS: Record<string, SpecialCharacters> = {
  '(': SpecialCharacters.OPEN_PARENTHESIS,
  ')': SpecialCharacters.CLOSE_PARENTHESIS,
};

export const OPERATORS: Record<string, Operators> = {
  AND: Operators.AND,
  OR: Operators.OR,
  XOR: Operators.XOR,
  NOT: Operators.NOT,
};

// TODO: Add all space characters
export const DELIMITERS = new Set([' ', '\n']);
