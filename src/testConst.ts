import { Operators, Tokens } from './types';

export const TRUE = { name: Tokens.IDENTIFIER, value: 'true' };
export const FALSE = { name: Tokens.IDENTIFIER, value: 'false' };
export const NOT = { name: Tokens.OPERATOR, value: Operators.NOT };
export const XOR = { name: Tokens.OPERATOR, value: Operators.XOR };
export const AND = { name: Tokens.OPERATOR, value: Operators.AND };
export const OR = { name: Tokens.OPERATOR, value: Operators.OR };
