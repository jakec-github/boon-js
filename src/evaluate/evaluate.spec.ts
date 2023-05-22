import { TRUE, FALSE, AND, NOT, XOR } from '../testConst';
import { Tokens } from '../types';

import { evaluate, evaluateExpression, getEvaluator } from './evaluate';

const BOOLEAN_MAP = {
  true: true,
  false: false
};

describe('getEvaluator', () => {
  test('should handle a complicated expression', () => {
    const getEvaluatorResult = getEvaluator(
      'NOT (true AND true AND NOT true) XOR (NOT false XOR false)'
    )(BOOLEAN_MAP);

    expect(getEvaluatorResult).toEqual(false);

    const evaluateExpressionResult = evaluateExpression(
      'NOT (true AND true AND NOT true) XOR (NOT false XOR false)',
      BOOLEAN_MAP
    );

    expect(evaluateExpressionResult).toEqual(false);
  });

  test('should handle leading NOT operator', () => {
    const result1 = getEvaluator('NOT true')(BOOLEAN_MAP);
    const result2 = getEvaluator('NOT false')(BOOLEAN_MAP);

    expect(result1).toEqual(false);
    expect(result2).toEqual(true);

    const evaluateExpressionResult1 = evaluateExpression(
      'NOT true',
      BOOLEAN_MAP
    );
    const evaluateExpressionResult2 = evaluateExpression(
      'NOT false',
      BOOLEAN_MAP
    );

    expect(evaluateExpressionResult1).toEqual(false);
    expect(evaluateExpressionResult2).toEqual(true);
  });

  test('should handle OR, XOR, AND', () => {
    const getEvaluatorResult = getEvaluator('true OR true XOR false AND false')(
      BOOLEAN_MAP
    );

    expect(getEvaluatorResult).toEqual(true);

    const evaluateExpressionResult = evaluateExpression(
      'true OR true XOR false AND false',
      BOOLEAN_MAP
    );

    expect(evaluateExpressionResult).toEqual(true);
  });
});

describe('evaluate', () => {
  test('should return false for simple parsedExpression', () => {
    const result = evaluate([TRUE, FALSE, AND], BOOLEAN_MAP);

    expect(result).toEqual(false);
  });

  test('should return true for a complex expression', () => {
    const result = evaluate(
      [FALSE, NOT, TRUE, AND, FALSE, NOT, TRUE, NOT, XOR, AND],
      BOOLEAN_MAP
    );

    expect(result).toEqual(true);
  });

  test('should throw if the expression passed is not an array', () => {
    expect(() => {
      evaluate(null, BOOLEAN_MAP);
    }).toThrow(
      'null should be an array. evaluate takes in a parsed expression. Use in combination with parse or use getEvaluator'
    );
  });

  test('should throw if the expression contains incorrectly typed tokens', () => {
    expect(() => {
      evaluate([null], BOOLEAN_MAP);
    }).toThrow('Invalid token: null. Found in parsed expression at index 0');

    expect(() => {
      evaluate([{ name: Tokens.OPERATOR, value: null }], BOOLEAN_MAP);
    }).toThrow(
      'Invalid token: [object Object]. Found in parsed expression at index 0'
    );
  });

  test('should throw if the expression is not a valid postfix expression', () => {
    expect(() => {
      evaluate([TRUE, TRUE, NOT], BOOLEAN_MAP);
    }).toThrow(
      'Invalid postfix expression: too many identifiers after evaluation'
    );
  });
});
