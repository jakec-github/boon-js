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

const checkToken = (rawString: string, token: Token): void => {
  const lexResult = lex(rawString);
  const paddedLexResult = lex(`  ${rawString}  `);

  expect(lexResult.token).toEqual(token);
  expect(paddedLexResult.token).toEqual(token);
};

const checkEntireExpression = (
  expression: string,
  expectedTokens: Token[],
): void => {
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

const isToken = (token: Token | Token[]): token is Token =>
  !Boolean((token as Token[]).length);

const checkComments = (
  expression: string,
  expectedTokens: Token | Token[],
): void => {
  if (isToken(expectedTokens)) {
    checkToken(expression, expectedTokens);
  } else {
    checkEntireExpression(expression, expectedTokens);
  }
};

const checkRemainder = (
  rawString: string,
  token: Token,
  remainingString: string,
): void => {
  const lexResult = lex(rawString);

  expect(lexResult.token).toEqual(token);
  expect(lexResult.remainingString).toEqual(remainingString);
};

const checkError = (rawString: string, message: string): void => {
  expect(() => {
    lex(rawString);
  }).toThrow(message);
};

describe('lex', () => {
  describe('Basic Tests', () => {
    test.each(basicTests)('%s', (_, ...args) => checkToken(...args));
  });

  describe('Identifiers', () => {
    test.each(identifierTests)('%s', (_, ...args) => checkToken(...args));
  });

  describe('Structural characters', () => {
    test.each(structuralCharacterTests)('%s', (_, ...args) =>
      checkEntireExpression(...args),
    );
  });

  describe('Comments', () => {
    test.each(commentTests)('%s', (_, ...args) => checkComments(...args));
  });

  describe('Remaining string', () => {
    test.each(remainingStringTests)('%s', (_, ...args) =>
      checkRemainder(...args),
    );
  });

  describe('Complex tests', () => {
    test.each(complexTests)('%s', (_, ...args) =>
      checkEntireExpression(...args),
    );
  });

  describe('Unhappy path', () => {
    test.each(unhappyTests)('%s', (_, ...args) => checkError(...args));
  });
});
