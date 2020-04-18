import { Token, Operators, Tokens, SpecialCharacters } from '../types';

export const OPERATOR_PRECEDENCE = {
  NOT: 0,
  XOR: 1,
  AND: 2,
  OR: 3,
};

export const VALID_TOKENS: Record<string, Token[]> = {
  operandOnly: [
    { name: Tokens.OPERAND },
    {
      name: Tokens.SPECIAL_CHARACTER,
      value: SpecialCharacters.OPEN_PARENTHESIS,
    },
  ],
  operandOrNot: [
    { name: Tokens.OPERAND },
    {
      name: Tokens.SPECIAL_CHARACTER,
      value: SpecialCharacters.OPEN_PARENTHESIS,
    },
    { name: Tokens.OPERATOR, value: Operators.NOT },
  ],
  binaryOperator: [
    { name: Tokens.OPERATOR, value: Operators.AND },
    { name: Tokens.OPERATOR, value: Operators.OR },
    { name: Tokens.OPERATOR, value: Operators.XOR },
  ],
  binaryOperatorOrClose: [
    { name: Tokens.OPERATOR, value: Operators.AND },
    { name: Tokens.OPERATOR, value: Operators.OR },
    { name: Tokens.OPERATOR, value: Operators.XOR },
    {
      name: Tokens.SPECIAL_CHARACTER,
      value: SpecialCharacters.CLOSE_PARENTHESIS,
    },
  ],
};
