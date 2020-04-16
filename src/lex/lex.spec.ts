import { Tokens } from '../types';

import { lex } from './lex';
import {
  withSingleVariable,
  withSingleVariableAnswer,
  withAndOperator,
  withNestedParentheses,
  withOrOperator,
  withOrOperatorAnswer,
  withParentheses,
  withParenthesesAnswer,
  withNestedParenthesesAnswer,
  withNotOperator,
  withNotOperatorAnswer,
  withMultipleNestedNotOperators,
  withMultipleNestedNotOperatorsAnswer,
  withXorOperator,
  withXorOperatorAnswer,
  withSpacedParentheses,
  withSpacedParenthesesAnswer,
  withLineBreaks,
  withLineBreaksAnswer,
  withTrailingWhitespace,
  withTrailingWhitespaceAnswer,
  emptyString,
  whitespace,
  newLine,
  severalWhitespaces,
} from './testData';
import { lexEntireExpression } from './testUtils';

describe('lex', () => {
  test('should parse one token and return remaining string', () => {
    const result = lex(withAndOperator);

    expect(result).toEqual({
      token: {
        name: Tokens.OPERAND,
        value: 'first',
      },
      remainingString: ' AND second',
    });
  });

  test('should parse an entire expression', () => {
    const result = lexEntireExpression(withOrOperator);

    expect(result).toEqual(withOrOperatorAnswer);
  });

  test('should parse an expression with just one variable', () => {
    const result = lexEntireExpression(withSingleVariable);

    expect(result).toEqual(withSingleVariableAnswer);
  });

  test('should lex a expressions with any sequence of tokens', () => {
    const tests = {
      [withParentheses]: withParenthesesAnswer,
      [withNestedParentheses]: withNestedParenthesesAnswer,
      [withNotOperator]: withNotOperatorAnswer,
      [withMultipleNestedNotOperators]: withMultipleNestedNotOperatorsAnswer,
      [withXorOperator]: withXorOperatorAnswer,
    };

    Object.entries(tests).forEach(([expression, response]) => {
      expect(lexEntireExpression(expression)).toEqual(response);
    });
  });

  test('should lex expressions in a range of formats', () => {
    const tests = {
      [withSpacedParentheses]: withSpacedParenthesesAnswer,
      [withLineBreaks]: withLineBreaksAnswer,
      [withTrailingWhitespace]: withTrailingWhitespaceAnswer,
    };

    Object.entries(tests).forEach(([expression, response]) => {
      expect(lexEntireExpression(expression)).toEqual(response);
    });
  });

  test('should just return an EOF token when to tokens are found', () => {
    const tests = [emptyString, whitespace, severalWhitespaces, newLine];

    tests.forEach((expression) => {
      expect(lexEntireExpression(expression)).toEqual([{ name: Tokens.EOF }]);
    });
  });
});
