import cases from 'jest-in-case';

import {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  AND,
  NOT,
  XOR,
  OR,
} from '../testConst';
import { PostfixExpression } from '../types';

import { parse } from './parse';
import { commentTests } from '../lex/testData';

interface EqualityTest {
  expression: string;
  postfix: PostfixExpression;
}

const checkEquality = ({ expression, postfix }: EqualityTest): void => {
  expect(parse(expression)).toEqual(postfix);
};

interface ErrorTest {
  expression: string;
  message: string;
}

const checkError = ({ expression, message }: ErrorTest): void => {
  expect(() => {
    parse(expression);
  }).toThrow(message);
};

describe('parse', () => {
  const basicTests = {
    'parse a lone identifier': {
      expression: 'first',
      postfix: [FIRST],
    },
    'parse a simple expression': {
      expression: 'first AND second',
      postfix: [FIRST, SECOND, AND],
    },
    'handle the NOT operator': {
      expression: 'NOT first',
      postfix: [FIRST, NOT],
    },
  };

  cases('basic tests', checkEquality, basicTests);

  const operatorPrecedence = {
    'parse an expression with an AND then an OR operator': {
      expression: 'first AND second OR third',
      postfix: [FIRST, SECOND, AND, THIRD, OR],
    },
    'parse an expression with an AND then an AND operator': {
      expression: 'first AND second AND third',
      postfix: [FIRST, SECOND, AND, THIRD, AND],
    },
    'parse an expression with an XOR, AND then an OR operator': {
      expression: 'first XOR second AND third OR fourth',
      postfix: [FIRST, SECOND, XOR, THIRD, AND, FOURTH, OR],
    },
    'parse an expression with an OR then an AND operator': {
      expression: 'first OR second AND third',
      postfix: [FIRST, SECOND, THIRD, AND, OR],
    },
    'parse an expression with an AND then an XOR then an OR operator': {
      expression: 'first AND second XOR third OR fourth',
      postfix: [FIRST, SECOND, THIRD, XOR, AND, FOURTH, OR],
    },
    'parse an expression with an OR then an AND then an XOR operator': {
      expression: 'first OR second AND third XOR fourth',
      postfix: [FIRST, SECOND, THIRD, FOURTH, XOR, AND, OR],
    },
  };

  cases('operator precedence', checkEquality, operatorPrecedence);

  const parentheses = {
    'handle parentheses around an operator with lower precedence': {
      expression: '(first OR second) AND third',
      postfix: [FIRST, SECOND, OR, THIRD, AND],
    },
    'handle parentheses at the end of an expression': {
      expression: 'first XOR (second AND third)',
      postfix: [FIRST, SECOND, THIRD, AND, XOR],
    },
    'handle parentheses in the middle of an expression': {
      expression: 'first XOR (second AND third) OR fourth',
      postfix: [FIRST, SECOND, THIRD, AND, XOR, FOURTH, OR],
    },
    'handle nested parentheses': {
      expression:
        'NOT ((first OR second) AND NOT third) XOR (NOT fourth AND fifth)',
      postfix: [
        FIRST,
        SECOND,
        OR,
        THIRD,
        NOT,
        AND,
        NOT,
        FOURTH,
        NOT,
        FIFTH,
        AND,
        XOR,
      ],
    },
  };

  cases('parentheses', checkEquality, parentheses);

  const comments = {
    'Removes trailing comment': {
      expression: 'NOT first # Comment',
      postfix: [FIRST, NOT],
    },
    'Removes leading comment': {
      expression: `# Comment
      NOT first`,
      postfix: [FIRST, NOT],
    },
    'Removes subsequent comments': {
      expression: `# Comment 1
      # Comment 2
      NOT first
      # Comment 3
      # Comment 4`,
      postfix: [FIRST, NOT],
    },
    'Removes comments whereever they appear in the expression': {
      expression: `# Comment
      NOT # Comment
      ( # Comment
        first # Comment
        AND # Comment
        second # Comment
      ) # Comment`,
      postfix: [FIRST, SECOND, AND, NOT],
    },
  };

  cases('comments', checkEquality, comments);

  const complexTests = {
    'handle a complicated expression with multiple NOT operators': {
      expression: 'NOT first AND second AND NOT third XOR NOT fourth',
      postfix: [FIRST, NOT, SECOND, AND, THIRD, NOT, FOURTH, NOT, XOR, AND],
    },
    'handle a complicated expression with multiple NOT operators and parentheses': {
      expression:
        'NOT (first AND second AND NOT third) XOR (NOT fourth XOR fifth)',
      postfix: [
        FIRST,
        SECOND,
        AND,
        THIRD,
        NOT,
        AND,
        NOT,
        FOURTH,
        NOT,
        FIFTH,
        XOR,
        XOR,
      ],
    },
  };

  cases('complex tests', checkEquality, complexTests);

  const unhappyTests = {
    'throw if terms are out of order': {
      expression: 'AND first second',
      message: 'Invalid token',
    },
    'throw if the second term is missing': {
      expression: 'first AND',
      message: 'Unexpected end of expression',
    },
    'throw if the operator is repeated': {
      expression: 'first AND AND second',
      message: 'Invalid token',
    },
    'throw from an expression with an OR then a hanging AND operator': {
      expression: 'first OR second AND ',
      message: 'Unexpected end of expression',
    },
    'throw on two NOT operators in a row': {
      expression: 'NOT NOT',
      message: 'Invalid token',
    },
    'throw on lone NOT operator': {
      expression: 'NOT',
      message: 'Unexpected end of expression',
    },
    'throw on lone nested NOT operator': {
      expression: '(NOT)',
      messsage: 'Inavlid token',
    },
    'throw if there are too many closing parentheses': {
      expression: 'NOT ((first OR second) AND NOT third))',
      message: 'Invalid token',
    },
    'throw if there are too many opening parentheses': {
      expression: 'NOT (((first OR second) AND NOT third)',
      message: 'Unexpected end of expression',
    },
    'throw if an open parenthesis follows an identifier': {
      expression: 'first (',
      message: 'Invalid token',
    },
    'throw on empty expression': {
      expression: '',
      message: 'Unexpected end of expression',
    },
    'throw on expression with only a comment': {
      expression: '# Comment',
      message: 'Unexpected end of expression',
    },
    'throw if argument is not a string': {
      expression: null as string,
      message: 'Expected string but received object',
    },
  };

  cases('Unhappy path', checkError, unhappyTests);
});
