export enum Operators {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
  NOT = 'NOT',
}

export enum StructuralCharacters {
  OPEN_PARENTHESIS = '(',
  CLOSE_PARENTHESIS = ')',
}

export enum Tokens {
  IDENTIFIER = 'IDENTIFIER',
  OPERATOR = 'OPERATOR',
  STRUCTURAL_CHARACTER = 'STRUCTURAL_CHARACTER',
  EOF = 'EOF',
  COMMENT = 'COMMENT',
}

export interface Token {
  name:
    | Tokens.EOF
    | Tokens.IDENTIFIER
    | Tokens.OPERATOR
    | Tokens.STRUCTURAL_CHARACTER
    | Tokens.COMMENT;
  value?: string | Operators | StructuralCharacters;
}

export interface LexResult {
  token: Token;
  remainingString: string;
}

export type PostfixExpression = Token[];

export type BooleanMap = Record<string, any>;
