import { Operators, Tokens } from '../types';

import { evaluateExpression, getEvaluator } from './evaluate';

const BOOLEAN_MAP = {
  true: true,
  false: false,
};

describe('getEvaluator', () => {
  test('should handle a complicated expression', () => {
    const result = getEvaluator(
      'NOT (true AND true AND NOT true) XOR (NOT false XOR false)',
    )(BOOLEAN_MAP);

    expect(result).toEqual(false);
  });
});

describe('evaluateExpression', () => {
  test('should return false for simple parsedExpression', () => {
    const result = evaluateExpression(
      [
        { name: Tokens.OPERAND, value: 'true' },
        { name: Tokens.OPERAND, value: 'false' },
        { name: Tokens.OPERATOR, value: Operators.AND },
      ],
      BOOLEAN_MAP,
    );

    expect(result).toEqual(false);
  });

  test('should return true for a complex expression', () => {
    const result = evaluateExpression(
      [
        { name: Tokens.OPERAND, value: 'false' },
        { name: Tokens.OPERATOR, value: Operators.NOT },
        { name: Tokens.OPERAND, value: 'true' },
        { name: Tokens.OPERATOR, value: Operators.AND },
        { name: Tokens.OPERAND, value: 'false' },
        { name: Tokens.OPERATOR, value: Operators.NOT },
        { name: Tokens.OPERAND, value: 'true' },
        { name: Tokens.OPERATOR, value: Operators.NOT },
        { name: Tokens.OPERATOR, value: Operators.XOR },
        { name: Tokens.OPERATOR, value: Operators.AND },
      ],
      BOOLEAN_MAP,
    );

    expect(result).toEqual(true);
  });

  test('should throw if the expression passed is not an array', () => {
    expect(() => {
      evaluateExpression(null, BOOLEAN_MAP);
    }).toThrow(
      'null should be an array. evaluateExpression takes in a parsed expression. Use in combination with parse or use getEvaluator',
    );
  });

  test('should throw if the expression contains incorrectly typed tokens', () => {
    expect(() => {
      evaluateExpression([null], BOOLEAN_MAP);
    }).toThrow('Invalid token: null. Found in parsed expression at index 0');

    expect(() => {
      evaluateExpression([{ name: Tokens.OPERATOR, value: null }], BOOLEAN_MAP);
    }).toThrow(
      'Invalid token: [object Object]. Found in parsed expression at index 0',
    );
  });
});
