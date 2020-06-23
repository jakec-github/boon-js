import {
  TRUE,
  FALSE,
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  AND,
  NOT,
  XOR,
  OR,
  OPEN,
  CLOSE,
  EOF,
  SPACE,
  TAB,
  LINE_FEED,
  CARRIAGE_RETURN,
} from '../testConst';
import { Tokens } from '../types';

export const basicTests = {
  'lex NOT operator': {
    rawString: 'NOT',
    token: FIRST,
  },
  'lex XOR operator': {
    rawString: 'XOR',
    token: XOR,
  },
  'lex AND operator': {
    rawString: 'AND',
    token: AND,
  },
  'lex OR operator': {
    rawString: 'OR',
    token: OR,
  },
  'lex an unquoted identifier': {
    rawString: 'true',
    token: TRUE,
  },
  'lex a quoted identifier': {
    rawString: '"false"',
    token: FALSE,
  },
  'lex an open parenthesis': {
    rawString: '(',
    token: OPEN,
  },
  'lex a close parenthesis': {
    rawString: ')',
    token: CLOSE,
  },
  'lex a comment': {
    rawString: `# comment${LINE_FEED}`,
    token: { name: Tokens.COMMENT, value: ' comment' },
  },
  'return an EOF token when no token is found': {
    rawString: '',
    token: EOF,
  },
};

export const identifierTests = {
  'return identifier token for lowercase operator': {
    rawString: 'and',
    token: { name: Tokens.IDENTIFIER, value: 'and' },
  },
  'lex an unquoted identifier containing a # character': {
    rawString: 'and#2',
    token: { name: Tokens.IDENTIFIER, value: 'and#2' },
  },
  'handle structural character in quoted identifier': {
    rawString: '"("',
    token: { name: Tokens.IDENTIFIER, value: '(' },
  },
  'handle space character in quoted identifier': {
    rawString: `"${SPACE}"`,
    token: { name: Tokens.IDENTIFIER, value: SPACE },
  },
  'handle tab character in quoted identifier': {
    rawString: `"${TAB}"`,
    token: { name: Tokens.IDENTIFIER, value: TAB },
  },
  'handle line feed character in quoted identifier': {
    rawString: `"${LINE_FEED}"`,
    token: { name: Tokens.IDENTIFIER, value: LINE_FEED },
  },
  'handle carriage return character in quoted identifier': {
    rawString: `"${CARRIAGE_RETURN}"`,
    token: { name: Tokens.IDENTIFIER, value: CARRIAGE_RETURN },
  },
  'handle space then # character in quoted identifier': {
    rawString: `"${SPACE}#"`,
    token: { name: Tokens.IDENTIFIER, value: `${SPACE}#` },
  },
};

export const specialCharacterTests = {
  'handle structural characters that are not separated using whitespace': {
    expression: 'NOT(first)',
    expectedTokens: [NOT, OPEN, FIRST, CLOSE, EOF],
  },
  'handle nested structrual characters': {
    expression: '((first AND second) XOR (third))',
    expectedTokens: [
      OPEN,
      OPEN,
      FIRST,
      AND,
      SECOND,
      CLOSE,
      XOR,
      OPEN,
      THIRD,
      CLOSE,
      CLOSE,
    ],
  },
  'handle space as separator': {
    expression: `NOT${SPACE}first`,
    expectedTokens: [NOT, FIRST, EOF],
  },
  'handle tab as separator': {
    expression: `NOT${TAB}first`,
    expectedTokens: [NOT, FIRST, EOF],
  },
  'handle line feed as separator': {
    expression: `NOT${LINE_FEED}first`,
    expectedTokens: [NOT, FIRST, EOF],
  },
  'handle carriage return as separator': {
    expression: `NOT${CARRIAGE_RETURN}first`,
    expectedTokens: [NOT, FIRST, EOF],
  },
  'return EOF for whitespace characters': {
    expression: `${SPACE}${TAB}${LINE_FEED}${CARRIAGE_RETURN}`,
    expectedTokens: [EOF],
  },
};

export const commentTests = {
  'handle comments containing special characters': {
    rawString: `# (${SPACE}${TAB}${CARRIAGE_RETURN}#) ${LINE_FEED}`,
    token: {
      name: Tokens.COMMENT,
      value: ` (${SPACE}${TAB}${CARRIAGE_RETURN}#) `,
    },
  },
  'handle multiline comment': {
    expression: `# Comment line 1
    # Comment line 2
    # Comment line 3`,
    expectedTokens: [
      {
        name: Tokens.COMMENT,
        value: ' Comment line 1',
      },
      {
        name: Tokens.COMMENT,
        value: ' Comment line 2',
      },
      {
        name: Tokens.COMMENT,
        value: ' Comment line 3',
      },
    ],
  },
};

export const remainingStringTests = {
  'lex an operator and return remaining string': {
    rawString: 'XOR first',
    token: XOR,
    remainingString: ' first',
  },
  'lex an unquoted identifier and return remaining string': {
    rawString: 'first OR',
    token: FIRST,
    remainingString: ' OR',
  },
  'lex a quoted identifier and return remaining string': {
    rawString: '"first" AND',
    token: FIRST,
    remainingString: ' AND',
  },
  'lex open parenthesis and return remaining string': {
    rawString: '(NOT',
    token: OPEN,
    remainingString: 'NOT',
  },
  'lex close parenthesis and return remaining string': {
    rawString: `)${LINE_FEED}AND`,
    token: CLOSE,
    remainingString: `${LINE_FEED}AND`,
  },
  'return empty remaining string with EOF token': {
    rawString: `${LINE_FEED}`,
    token: EOF,
    remainingString: '',
  },
};

export const complexTests = {
  'lex an entire expression': {
    expression: '(first OR (second AND third)) AND fourth',
    expectedTokens: [
      OPEN,
      FIRST,
      OR,
      OPEN,
      SECOND,
      AND,
      THIRD,
      CLOSE,
      CLOSE,
      AND,
      FOURTH,
      EOF,
    ],
  },
  'lex an expression spanning several lines with comments': {
    expression: `# Comment 1
    first # Comment 2
    AND second # Comment 3
    # Comment 4`,
    expectedTokens: [
      {
        name: Tokens.COMMENT,
        value: ' Comment 1',
      },
      FIRST,
      {
        name: Tokens.COMMENT,
        value: ' Comment 2',
      },
      AND,
      SECOND,
      {
        name: Tokens.COMMENT,
        value: ' Comment 3',
      },
      {
        name: Tokens.COMMENT,
        value: ' Comment 4',
      },
    ],
  },
  'lex a grammatically invalid sequence of tokens without error': {
    expression: 'AND ) OR first NOT ) ( "second"',
    expectedTokens: [AND, CLOSE, OR, FIRST, NOT, CLOSE, OPEN, SECOND, EOF],
  },
  'return a single identifer when no special characters are found': {
    expression: 'firstANDsecondORthird',
    expectedTokens: [
      {
        name: Tokens.IDENTIFIER,
        value: 'firstANDsecondORthird',
      },
      EOF,
    ],
  },
};

export const unhappyTests = {
  'throw on an unterminated quoted identifier': {
    rawString: '"first AND second',
    message: 'Unexpected end of expression: expected " character',
  },
  'throw if quoted identifier is not followed by separator or structural character': {
    rawString: '"first"#',
    message: 'Unexpected character: expected ( character or separator',
  },
};
