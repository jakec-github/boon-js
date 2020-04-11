// This type may need to be exported publicly since
// it is found in the result
// Should include NOT
export enum Operators {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
}

export enum Tokens {
  VARIABLE, // To become OPERAND
  OPERATOR,
  OPEN_PARENTHESIS,
  CLOSE_PARENTHESIS,
  NEGATION,
}

export type TokenSet = Set<Tokens>;

export type ExpressionValue = string | ParsedOperator;
// Inverted should read negated for consistency
export interface ParsedExpression {
  value: ExpressionValue;
  inverted: boolean;
}

export interface ParsedOperator {
  left: ParsedExpression;
  right: ParsedExpression;
  operator: Operators;
}

// TODO: Split this into a set of more specific types
export interface LexToken {
  type: Tokens;
  value?: string;
  subType?: Operators;
}
// These types don't contain operator and need to be updated
export interface LexResult {
  token: LexToken;
  remainingString: string;
}

export enum PostfixTypes {
  OPERAND = 'OPERAND',
  OPERATOR = 'OPERATOR',
}

interface OperandSymbol {
  type: PostfixTypes.OPERAND;
  value: string;
}

export interface OperatorSymbol {
  type: PostfixTypes.OPERATOR;
  value: Operators;
}

export type Symbol = OperandSymbol | OperatorSymbol;

export type PostfixExpression = Symbol[];
export type OperatorStack = OperatorSymbol[];
