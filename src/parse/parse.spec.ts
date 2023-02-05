import { PostfixExpression } from '../types';

import { parse } from './parse';
import {
  basic,
  comments,
  complex,
  operatorPrecedence,
  parentheses,
  unhappyPath,
} from './testData';

const checkEquality = (
  expression: string,
  postfix: PostfixExpression,
): void => {
  expect(parse(expression)).toEqual(postfix);
};

const checkError = (expression: string, message: string): void => {
  expect(() => {
    parse(expression);
  }).toThrow(message);
};

describe('parse', () => {
  describe('Basic expressions', () => {
    test.each(basic)('parse %s', (_, ...args) => checkEquality(...args));
  });

  describe('Operator precedence', () => {
    test.each(operatorPrecedence)('parse expression: %s', (_, ...args) =>
      checkEquality(...args),
    );
  });

  describe('Parentheses', () => {
    test.each(parentheses)('parse parentheses: %s', (_, ...args) =>
      checkEquality(...args),
    );
  });

  describe('Comments', () => {
    test.each(comments)('%s', (_, ...args) => checkEquality(...args));
  });

  describe('Complex expressions', () => {
    test.each(complex)('parse complex expression: %s', (_, ...args) =>
      checkEquality(...args),
    );
  });

  describe('Unhappy path', () => {
    test.each(unhappyPath)('throw on %s', (_, ...args) => checkError(...args));
  });
});
