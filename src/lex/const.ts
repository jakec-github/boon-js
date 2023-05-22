import { Operators, StructuralCharacters } from '../types';

export const STRUCTURAL_CHARACTERS: Record<string, StructuralCharacters> = {
  '(': StructuralCharacters.OPEN_PARENTHESIS,
  ')': StructuralCharacters.CLOSE_PARENTHESIS
};

export const OPERATORS: Record<string, Operators> = {
  AND: Operators.AND,
  OR: Operators.OR,
  XOR: Operators.XOR,
  NOT: Operators.NOT
};

export const SEPARATORS = new Set(
  [
    0x0020, // Space
    0x0009, // Character tabulation
    0x000a, // Line feed
    0x000d // Carriage return
  ].map((separator) => String.fromCodePoint(separator))
);

export const QUOTED_IDENTIFIER_DELIMITER = String.fromCodePoint(0x0022);
export const COMMENT_DELIMITER = String.fromCodePoint(0x0023);
export const EOL = String.fromCodePoint(0x000a);
export const ESCAPE_CHARACTER = String.fromCodePoint(0x005c);
