import { Operators, PostfixTypes } from '../types';

import { parsePostfix } from './parsePostfix';

describe('parse', () => {
  test('should parse a single value', () => {
    const result = parsePostfix('first');

    expect(result).toEqual([{ type: PostfixTypes.OPERAND, value: 'first' }]);
  });

  test('should parse a simple expression', () => {
    const result = parsePostfix('first AND second');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should throw if terms are out of order', () => {
    expect(() => {
      parsePostfix('AND first second');
    }).toThrow('Invalid token');
  });

  test('should throw if the second term is missing', () => {
    expect(() => {
      parsePostfix('first AND');
    }).toThrow('Unexpected end of expression');
  });

  test('should throw if the operator is repeated', () => {
    expect(() => {
      parsePostfix('first AND AND second');
    }).toThrow('Invalid token');
  });

  test('should throw from an expression with an OR then a hanging AND operator', () => {
    expect(() => {
      parsePostfix('first OR second AND ');
    }).toThrow('Unexpected end of expression');
  });

  test('should parse an expression with an AND then an OR operator', () => {
    const result = parsePostfix('first AND second OR third');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an AND then an AND operator', () => {
    const result = parsePostfix('first AND second AND third');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should parse an expression with an XOR, AND then an OR operator', () => {
    const result = parsePostfix('first XOR second AND third OR fourth');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERATOR, value: Operators.XOR },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERAND, value: 'fourth' },
      { type: PostfixTypes.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an OR then an AND operator', () => {
    const result = parsePostfix('first OR second AND third');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an AND then an XOR then an OR operator', () => {
    const result = parsePostfix('first AND second XOR third OR fourth');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERATOR, value: Operators.XOR },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERAND, value: 'fourth' },
      { type: PostfixTypes.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an OR then an AND then an XOR operator', () => {
    const result = parsePostfix('first OR second AND third XOR fourth');

    expect(result).toEqual([
      { type: PostfixTypes.OPERAND, value: 'first' },
      { type: PostfixTypes.OPERAND, value: 'second' },
      { type: PostfixTypes.OPERAND, value: 'third' },
      { type: PostfixTypes.OPERAND, value: 'fourth' },
      { type: PostfixTypes.OPERATOR, value: Operators.XOR },
      { type: PostfixTypes.OPERATOR, value: Operators.AND },
      { type: PostfixTypes.OPERATOR, value: Operators.OR },
    ]);
  });
});
