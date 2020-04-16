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

interface TokenBase {
  name: Tokens;
}
export interface OperatorToken extends TokenBase {
  value: Operators;
}
interface OperandToken extends TokenBase {
  value: string;
}
interface SpecialCharacterToken extends TokenBase {
  value: SpecialCharacters;
}

export type Token =
  | TokenBase
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
