import cases from 'jest-in-case';

import { Token, Tokens } from '../types';

import { lex } from './lex';
import {
  basicTests,
  identifierTests,
  structuralCharacterTests,
  commentTests,
  remainingStringTests,
  complexTests,
  unhappyTests,
} from './testData';

interface TokenTest {
  rawString: string;
  token: Token;
}

const checkToken = ({ rawString, token }: TokenTest): void => {
  const lexResult = lex(rawString);
  const paddedLexResult = lex(`  ${rawString}  `);

  expect(lexResult.token).toEqual(token);
  expect(paddedLexResult.token).toEqual(token);
};

interface ExpressionTest {
  expression: string;
  expectedTokens: Token[];
}

const checkEntireExpression = ({
  expression,
  expectedTokens,
}: ExpressionTest): void => {
  let remainingString = expression;
  let tokens: Token[] = [];
  while (true) {
    const result = lex(remainingString);
    remainingString = result.remainingString;
    tokens = [...tokens, result.token];
    if (result.token.name === Tokens.EOF) {
      break;
    }
  }

  expect(tokens).toEqual(expectedTokens);
};

const isTokenTest = (test: TokenTest | ExpressionTest): test is TokenTest =>
  Boolean((test as TokenTest).rawString);

const checkComments = (test: TokenTest | ExpressionTest): void => {
  if (isTokenTest(test)) {
    checkToken(test);
  } else {
    checkEntireExpression(test);
  }
};

interface RemainderTest {
  rawString: string;
  token: Token;
  remainingString: string;
}

const checkRemainder = ({
  rawString,
  token,
  remainingString,
}: RemainderTest): void => {
  const lexResult = lex(rawString);

  expect(lexResult.token).toEqual(token);
  expect(lexResult.remainingString).toEqual(remainingString);
};

interface ErrorTest {
  rawString: string;
  message: string;
}

const checkError = ({ rawString, message }: ErrorTest): void => {
  expect(() => {
    lex(rawString);
  }).toThrow(message);
};

describe('lex', () => {
  cases('Basic tests', checkToken, basicTests);
  cases('Identifiers', checkToken, identifierTests);
  cases(
    'Structural characters',
    checkEntireExpression,
    structuralCharacterTests,
  );
  cases('Comments', checkComments, commentTests);
  cases('Remaining string', checkRemainder, remainingStringTests);
  cases('Complex tests', checkEntireExpression, complexTests);
  cases('unhappyPath', checkError, unhappyTests);
});
