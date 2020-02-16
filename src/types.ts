export enum Operators {
  AND,
  OR,
  XOR,
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
