import { Tokens } from '../types';

export const withAndOperator = 'first AND second';
export const withOrOperator = 'first OR second';
export const withParentheses = '(first AND second) OR third';
export const withNestedParentheses = '(first OR (second AND third)) AND fourth';
export const withNotOperator = 'first AND NOT second';
export const withMultipleNestedNotOperators =
  'first AND (NOT second OR NOT third)';
export const withXorOperator = 'first XOR second';

export const withSpacedParentheses = 'first AND NOT ( second OR third )';
export const withLineBreaks = `first
OR
second
AND
  (
    third XOR fourth
  )
`;
export const withTrailingWhitespace = 'first AND second ';

export const emptyString = '';
export const whitespace = ' ';
export const severalWhitespaces = '          ';
export const newLine = '\n';

export const withAndOperatorAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.VARIABLE, value: 'second' },
];
export const withOrOperatorAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.VARIABLE, value: 'second' },
];
export const withParenthesesAnswer = [
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.VARIABLE, value: 'second' },
  { type: Tokens.CLOSE_PARENTHESIS },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.VARIABLE, value: 'third' },
];
export const withNestedParenthesesAnswer = [
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.VARIABLE, value: 'second' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.VARIABLE, value: 'third' },
  { type: Tokens.CLOSE_PARENTHESIS },
  { type: Tokens.CLOSE_PARENTHESIS },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.VARIABLE, value: 'fourth' },
];
export const withNotOperatorAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.NEGATION, value: 'NOT' },
  { type: Tokens.VARIABLE, value: 'second' },
];
export const withMultipleNestedNotOperatorsAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.NEGATION, value: 'NOT' },
  { type: Tokens.VARIABLE, value: 'second' },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.NEGATION, value: 'NOT' },
  { type: Tokens.VARIABLE, value: 'third' },
  { type: Tokens.CLOSE_PARENTHESIS },
];
export const withXorOperatorAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'XOR' },
  { type: Tokens.VARIABLE, value: 'second' },
];

export const withSpacedParenthesesAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.NEGATION, value: 'NOT' },
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.VARIABLE, value: 'second' },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.VARIABLE, value: 'third' },
  { type: Tokens.CLOSE_PARENTHESIS },
];
export const withLineBreaksAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'OR' },
  { type: Tokens.VARIABLE, value: 'second' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.OPEN_PARENTHESIS },
  { type: Tokens.VARIABLE, value: 'third' },
  { type: Tokens.OPERATOR, value: 'XOR' },
  { type: Tokens.VARIABLE, value: 'fourth' },
  { type: Tokens.CLOSE_PARENTHESIS },
];
export const withTrailingWhitespaceAnswer = [
  { type: Tokens.VARIABLE, value: 'first' },
  { type: Tokens.OPERATOR, value: 'AND' },
  { type: Tokens.VARIABLE, value: 'second' },
];
