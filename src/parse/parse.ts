import { Operators, ParsedExpression } from '../types';

// Sanitisation should be performed here if required. e.g Complaining about parentheses
export const parse = (expression: string): ParsedExpression => ({
  left: { value: 'first', inverted: false },
  right: { value: 'second', inverted: false },
  operator: Operators.AND,
});
