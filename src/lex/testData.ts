import { Tokens, SpecialCharacters, Operators } from '../types';

export const withSingleVariable = 'first';
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

export const withSingleVariableAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.EOF },
];
export const withAndOperatorAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.EOF },
];
export const withOrOperatorAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.EOF },
];
export const withParenthesesAnswer = [
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERAND, value: 'second' },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.OPERAND, value: 'third' },
  { name: Tokens.EOF },
];
export const withNestedParenthesesAnswer = [
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERAND, value: 'third' },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERAND, value: 'fourth' },
  { name: Tokens.EOF },
];
export const withNotOperatorAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERATOR, value: Operators.NOT },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.EOF },
];
export const withMultipleNestedNotOperatorsAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERATOR, value: Operators.NOT },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.OPERATOR, value: Operators.NOT },
  { name: Tokens.OPERAND, value: 'third' },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  { name: Tokens.EOF },
];
export const withXorOperatorAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.XOR },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.EOF },
];

export const withSpacedParenthesesAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERATOR, value: Operators.NOT },
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.OPERAND, value: 'third' },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  { name: Tokens.EOF },
];
export const withLineBreaksAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.OR },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.SPECIAL_CHARACTER, value: SpecialCharacters.OPEN_PARENTHESIS },
  { name: Tokens.OPERAND, value: 'third' },
  { name: Tokens.OPERATOR, value: Operators.XOR },
  { name: Tokens.OPERAND, value: 'fourth' },
  {
    name: Tokens.SPECIAL_CHARACTER,
    value: SpecialCharacters.CLOSE_PARENTHESIS,
  },
  { name: Tokens.EOF },
];
export const withTrailingWhitespaceAnswer = [
  { name: Tokens.OPERAND, value: 'first' },
  { name: Tokens.OPERATOR, value: Operators.AND },
  { name: Tokens.OPERAND, value: 'second' },
  { name: Tokens.EOF },
];
