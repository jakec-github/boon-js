export enum Operators {
  AND,
  OR,
  XOR,
}

export enum Tokens {
  VARIABLE,
  OPERATOR,
  OPEN_PARENTHESIS,
  CLOSE_PARENTHESIS,
  NEGATION,
}

interface ParsedValue {
  value: string | ParsedExpression;
  inverted: boolean;
}

export interface ParsedExpression {
  left: ParsedValue;
  right: ParsedValue;
  operator: Operators;
}

export interface LexToken {
  type: Tokens;
  value?: string;
}

export interface LexResult {
  token: LexToken;
  remainingString: string;
}
