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

export const SEPARATORS = [
  0x0020, // Space
  0x0009, // Character tabulation
  0x000a, // Line feed
  0x000d, // Carriage return
].map((separator) => String.fromCodePoint(separator));
