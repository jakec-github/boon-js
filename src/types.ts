export enum Operators {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  NOT = 'NOT',
}

export enum SpecialCharacters {
  OPEN_PARENTHESIS = '(',
  CLOSE_PARENTHESIS = ')',
}

export enum Tokens {
  IDENTIFIER = 'IDENTIFIER',
  OPERATOR = 'OPERATOR',
  SPECIAL_CHARACTER = 'SPECIAL_CHARACTER',
  EOF = 'EOF',
}

export interface Token {
  name:
    | Tokens.EOF
    | Tokens.IDENTIFIER
    | Tokens.OPERATOR
    | Tokens.SPECIAL_CHARACTER;
  value?: string | Operators | SpecialCharacters;
}

export interface LexResult {
  token: Token;
  remainingString: string;
}

export type PostfixExpression = Token[];

export type BooleanMap = Record<string, any>;
