import { Tokens, TokenSet } from '../types';

// Probably should have operators in an enum somewhere
// unless they are exposed to end user
export const OPERATOR_PRECEDENCE = {
  XOR: 1,
  AND: 2,
  OR: 3,
};

// For use in errors
// Not exported as not currently used
const TOKEN_DISPLAY_NAMES = {
  [Tokens.VARIABLE]: 'variable',
  [Tokens.OPERATOR]: 'operator',
  [Tokens.OPEN_PARENTHESIS]: '(',
  [Tokens.CLOSE_PARENTHESIS]: ')',
  [Tokens.NEGATION]: 'NOT',
};

export const TOKEN_SETS: Record<string, TokenSet> = {
  variable: new Set([Tokens.VARIABLE]),
  operator: new Set([Tokens.OPERATOR]),
};
