import { Tokens } from '../types';

export const OPERATOR_PRECEDENCE = {
  NOT: 0,
  XOR: 1,
  AND: 2,
  OR: 3,
};

// For use in errors
// Not exported as not currently used
const TOKEN_DISPLAY_NAMES = {
  [Tokens.OPERAND]: 'variable',
  [Tokens.OPERATOR]: 'operator',
  [Tokens.SPECIAL_CHARACTER]: 'special character',
};
