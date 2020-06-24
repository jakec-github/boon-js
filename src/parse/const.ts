import { Token, Operators, Tokens, StructuralCharacters } from '../types';

export const OPERATOR_PRECEDENCE = {
  NOT: 0,
  XOR: 1,
  AND: 2,
  OR: 3,
};

export const VALID_TOKENS: Record<string, Token[]> = {
  identifierOnly: [
    { name: Tokens.IDENTIFIER },
    {
      name: Tokens.STRUCTURAL_CHARACTER,
      value: StructuralCharacters.OPEN_PARENTHESIS,
    },
  ],
  identifierOrNot: [
    { name: Tokens.IDENTIFIER },
    {
      name: Tokens.STRUCTURAL_CHARACTER,
      value: StructuralCharacters.OPEN_PARENTHESIS,
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
      name: Tokens.STRUCTURAL_CHARACTER,
      value: StructuralCharacters.CLOSE_PARENTHESIS,
    },
  ],
};
