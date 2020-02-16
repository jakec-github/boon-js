import { Operators, ParsedExpression } from '../types';

export const parse = (expression: string): ParsedExpression => ({
  left: { value: 'first', inverted: false },
  right: { value: 'second', inverted: false },
  operator: Operators.AND,
});
