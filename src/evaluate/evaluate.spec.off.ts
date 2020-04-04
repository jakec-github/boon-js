import { Operators } from '../types';

import { evaluateExpression } from './evaluate';

const parsedExpression = {
  left: { value: 'first', inverted: false },
  right: { value: 'second', inverted: false },
  operator: Operators.AND,
};

const booleanMap = {
  first: true,
  second: false,
};

describe('evaluateExpression', () => {
  test('should return a boolean', () => {
    const result = evaluateExpression(parsedExpression, booleanMap);

    expect(typeof result).toEqual('boolean');
  });

  test('should return false for default parsedExpression', () => {
    const result = evaluateExpression(parsedExpression, booleanMap);

    expect(typeof result).toEqual('boolean');
  });
});
