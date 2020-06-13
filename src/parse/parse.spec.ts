import { Operators, Tokens } from '../types';

import { parse } from './parse';

describe('parse', () => {
  test('should parse a single value', () => {
    const result = parse('first');

    expect(result).toEqual([{ name: Tokens.IDENTIFIER, value: 'first' }]);
  });

  test('should parse a simple expression', () => {
    const result = parse('first AND second');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should throw if terms are out of order', () => {
    expect(() => {
      parse('AND first second');
    }).toThrow('Invalid token');
  });

  test('should throw if the second term is missing', () => {
    expect(() => {
      parse('first AND');
    }).toThrow('Unexpected end of expression');
  });

  test('should throw if the operator is repeated', () => {
    expect(() => {
      parse('first AND AND second');
    }).toThrow('Invalid token');
  });

  test('should throw from an expression with an OR then a hanging AND operator', () => {
    expect(() => {
      parse('first OR second AND ');
    }).toThrow('Unexpected end of expression');
  });

  test('should parse an expression with an AND then an OR operator', () => {
    const result = parse('first AND second OR third');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an AND then an AND operator', () => {
    const result = parse('first AND second AND third');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should parse an expression with an XOR, AND then an OR operator', () => {
    const result = parse('first XOR second AND third OR fourth');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an OR then an AND operator', () => {
    const result = parse('first OR second AND third');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an AND then an XOR then an OR operator', () => {
    const result = parse('first AND second XOR third OR fourth');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should parse an expression with an OR then an AND then an XOR operator', () => {
    const result = parse('first OR second AND third XOR fourth');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should handle the NOT operator', () => {
    const result = parse('NOT first');

    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
    ]);
  });

  test('should throw on two NOT operators in a row', () => {
    expect(() => {
      parse('NOT NOT');
    }).toThrow('Invalid token');
  });

  test('should handle a complicated expression with multiple NOT operators', () => {
    const result = parse('NOT first AND second AND NOT third XOR NOT fourth');
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should handle parentheses around an operator with lower precedence', () => {
    const result = parse('(first OR second) AND third');
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.OR },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
    ]);
  });

  test('should handle parentheses aat the end of an expression', () => {
    const result = parse('first XOR (second AND third)');
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.XOR },
    ]);
  });

  test('should handle parentheses at the end of an expression', () => {
    const result = parse('first XOR (second AND third)');
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.XOR },
    ]);
  });

  test('should handle parentheses in the middle of an expression', () => {
    const result = parse('first XOR (second AND third) OR fourth');
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.OR },
    ]);
  });

  test('should handle a complicated expression with multiple NOT operators and parentheses', () => {
    const result = parse(
      'NOT (first AND second AND NOT third) XOR (NOT fourth XOR fifth)',
    );
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'fifth' },
      { name: Tokens.OPERATOR, value: Operators.XOR },
      { name: Tokens.OPERATOR, value: Operators.XOR },
    ]);
  });

  test('should handle nested parentheses', () => {
    const result = parse(
      'NOT ((first OR second) AND NOT third) XOR (NOT fourth AND fifth)',
    );
    expect(result).toEqual([
      { name: Tokens.IDENTIFIER, value: 'first' },
      { name: Tokens.IDENTIFIER, value: 'second' },
      { name: Tokens.OPERATOR, value: Operators.OR },
      { name: Tokens.IDENTIFIER, value: 'third' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'fourth' },
      { name: Tokens.OPERATOR, value: Operators.NOT },
      { name: Tokens.IDENTIFIER, value: 'fifth' },
      { name: Tokens.OPERATOR, value: Operators.AND },
      { name: Tokens.OPERATOR, value: Operators.XOR },
    ]);
  });

  test('should throw if parentheses are not balanced', () => {
    expect(() => {
      parse(
        'NOT ((first OR second) AND NOT third)) XOR (NOT fourth AND fifth)',
      );
    }).toThrow('Invalid token');
  });

  test('should throw if argument is not a string', () => {
    expect(() => {
      parse(null);
    }).toThrow('Expected string but received object');
  });
});
