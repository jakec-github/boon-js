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

export interface ParsedValue {
  value: string | ParsedExpression;
  inverted: boolean;
}

// As boolean ops are all commutative
// left and right should be replaced by
// terms: [ParsedValue, ParsedValue];
export interface ParsedExpression {
  left: ParsedValue;
  right: ParsedValue;
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
