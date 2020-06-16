import { Operators, Tokens } from './types';

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
