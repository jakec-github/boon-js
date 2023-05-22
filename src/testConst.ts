import { Operators, StructuralCharacters, Tokens } from './types';

export const TRUE = { name: Tokens.IDENTIFIER, value: 'true' };
export const FALSE = { name: Tokens.IDENTIFIER, value: 'false' };

export const FIRST = { name: Tokens.IDENTIFIER, value: 'first' };
export const SECOND = { name: Tokens.IDENTIFIER, value: 'second' };
export const THIRD = { name: Tokens.IDENTIFIER, value: 'third' };
export const FOURTH = { name: Tokens.IDENTIFIER, value: 'fourth' };
export const FIFTH = { name: Tokens.IDENTIFIER, value: 'fifth' };

export const NOT = { name: Tokens.OPERATOR, value: Operators.NOT };
export const XOR = { name: Tokens.OPERATOR, value: Operators.XOR };
export const AND = { name: Tokens.OPERATOR, value: Operators.AND };
export const OR = { name: Tokens.OPERATOR, value: Operators.OR };

export const OPEN = {
  name: Tokens.STRUCTURAL_CHARACTER,
  value: StructuralCharacters.OPEN_PARENTHESIS
};
export const CLOSE = {
  name: Tokens.STRUCTURAL_CHARACTER,
  value: StructuralCharacters.CLOSE_PARENTHESIS
};

export const EOF = { name: Tokens.EOF };

export const [SPACE, TAB, LINE_FEED, CARRIAGE_RETURN] = [
  0x0020, // Space
  0x0009, // Character tabulation
  0x000a, // Line feed
  0x000d // Carriage return
].map((separator) => String.fromCodePoint(separator));
