// This type may need to be exported publicly since
// it is found in the result
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
  OPERAND = 'OPERAND',
  OPERATOR = 'OPERATOR',
  SPECIAL_CHARACTER = 'SPECIAL_CHARACTER',
  EOF = 'EOF',
}

interface TokenEOF {
  name: Tokens.EOF;
}
export interface OperatorToken {
  name: Tokens.OPERATOR;
  value: Operators;
}
export interface OperandToken {
  name: Tokens.OPERAND;
  value: string;
}
export interface SpecialCharacterToken {
  name: Tokens.SPECIAL_CHARACTER;
  value: SpecialCharacters;
}

export type Token =
  | TokenEOF
  | OperatorToken
  | OperandToken
  | SpecialCharacterToken;

export interface LexResult {
  token: Token;
  remainingString: string;
}

export type PostfixToken = OperatorToken | OperandToken;

export type PostfixExpression = PostfixToken[];
export type OperatorStack = OperatorToken[];

export enum TokenSets {
  OPERAND,
  OPERAND_OR_NOT,
  OPERATOR,
  OPERATOR_OR_CLOSE,
}

export type BooleanMap = Record<string, boolean>;
