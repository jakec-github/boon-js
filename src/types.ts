// This type may need to be exported globally since
// it is found in the result
export enum Operators {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
}

export enum Tokens {
  VARIABLE,
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
// These types don't contain operato and need to be updated
export interface LexResult {
  token: LexToken;
  remainingString: string;
}
