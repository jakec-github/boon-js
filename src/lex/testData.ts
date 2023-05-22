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
  CARRIAGE_RETURN
} from '../testConst';
import { Token, Tokens } from '../types';

const id = (value: string): Token => ({ name: Tokens.IDENTIFIER, value });
const comment = (value: string): Token => ({ name: Tokens.COMMENT, value });

export const basicTests: [string, string, Token][] = [
  ['lex NOT operator', 'NOT', NOT],
  ['lex XOR operator', 'XOR', XOR],
  ['lex AND operator', 'AND', AND],
  ['lex OR operator', 'OR', OR],
  ['lex an unquoted identifier', 'true', TRUE],
  ['lex a quoted identifier', '"false"', FALSE],
  ['lex an open parenthesis', '(', OPEN],
  ['lex a close parenthesis', ')', CLOSE],
  [
    'lex a comment',
    `# comment${LINE_FEED}`,
    { name: Tokens.COMMENT, value: ' comment' }
  ],
  ['return an EOF token when no token is found', '', EOF]
];

// Rewrite the indentifier tests in the forma of the basc tests
export const identifierTests: [string, string, Token][] = [
  ['return identifier token for lowercase operator', 'and', id('and')],
  ['handle structural character in quoted identifier', '"("', id('(')],
  ['handle NOT operator in quoted identifier', '"NOT"', id('NOT')],
  ['handle XOR operator in quoted identifier', '"XOR"', id('XOR')],
  ['handle AND operator in quoted identifier', '"AND"', id('AND')],
  ['handle OR operator in quoted identifier', '"OR"', id('OR')],
  ['handle space character in quoted identifier', `"${SPACE}"`, id(SPACE)],
  ['handle tab character in quoted identifier', `"${TAB}"`, id(TAB)],
  [
    'handle line feed character in quoted identifier',
    `"${LINE_FEED}"`,
    id(LINE_FEED)
  ],
  [
    'handle carriage return character in quoted identifier',
    `"${CARRIAGE_RETURN}"`,
    id(CARRIAGE_RETURN)
  ],
  [
    'handle multiple structural characters in quoted identifier',
    '"(())"',
    id('(())')
  ],
  ['handle multiple operators in quoted identifier', '"ANDOR"', id('ANDOR')],
  [
    'handle multiple operators and structural characters in quoted identifier',
    '"AND(OR)"',
    id('AND(OR)')
  ],
  [
    'handle space then # character in quoted identifier',
    `"${SPACE}#"`,
    id(`${SPACE}#`)
  ],
  ['handle empty quoted identifier', '""', id('')]
];

export const structuralCharacterTests: [string, string, Token[]][] = [
  [
    'handle structural characters that are not separated using whitespace',
    'NOT (first)',
    [NOT, OPEN, FIRST, CLOSE, EOF]
  ],
  [
    'handle nested structrual characters',
    '((first AND second) XOR (third))',
    [OPEN, OPEN, FIRST, AND, SECOND, CLOSE, XOR, OPEN, THIRD, CLOSE, CLOSE, EOF]
  ],
  ['handle space as separator', `NOT${SPACE}first`, [NOT, FIRST, EOF]],
  ['handle tab as separator', `NOT${TAB}first`, [NOT, FIRST, EOF]],
  ['handle line feed as separator', `NOT${LINE_FEED}first`, [NOT, FIRST, EOF]],
  [
    'handle carriage return as separator',
    `NOT${CARRIAGE_RETURN}first`,
    [NOT, FIRST, EOF]
  ],
  [
    'return EOF for whitespace characters',
    `${SPACE}${TAB}${LINE_FEED}${CARRIAGE_RETURN}`,
    [EOF]
  ]
];

export const commentTests: [string, string, Token | Token[]][] = [
  [
    'handle comments containing special characters',
    `# (${SPACE}${TAB}${CARRIAGE_RETURN}#) ${LINE_FEED}`,
    comment(` (${SPACE}${TAB}${CARRIAGE_RETURN}#) `)
  ],
  [
    'handle multiline comment',
    `# Comment line 1
    # Comment line 2
    # Comment line 3`,
    [
      comment(' Comment line 1'),
      comment(' Comment line 2'),
      comment(' Comment line 3'),
      EOF
    ]
  ],
  ['return lone # as empty comment', '#', [comment(''), EOF]],
  [
    'return # and EOL as empty comment',
    `#
    `,
    [comment(''), EOF]
  ]
];

export const remainingStringTests: [string, string, Token, string][] = [
  ['lex an operator and return remaining string', 'XOR first', XOR, ' first'],
  [
    'lex an unquoted identifier and return remaining string',
    'first OR',
    FIRST,
    ' OR'
  ],
  [
    'lex a quoted identifier and return remaining string',
    '"first" AND',
    FIRST,
    ' AND'
  ],
  ['lex open parenthesis and return remaining string', '(NOT', OPEN, 'NOT'],
  [
    'lex close parenthesis and return remaining string',
    `)${LINE_FEED}AND`,
    CLOSE,
    `${LINE_FEED}AND`
  ],
  ['return empty remaining string with EOF token', `${LINE_FEED}`, EOF, '']
];

export const complexTests: [string, string, Token[]][] = [
  [
    'lex an entire expression',
    '(first OR (second AND third)) AND fourth',
    [OPEN, FIRST, OR, OPEN, SECOND, AND, THIRD, CLOSE, CLOSE, AND, FOURTH, EOF]
  ],
  [
    'lex an expression with comments',
    `# Comment 1
    first # Comment 2
    AND second # Comment 3
    # Comment 4`,
    [
      comment(' Comment 1'),
      FIRST,
      comment(' Comment 2'),
      AND,
      SECOND,
      comment(' Comment 3'),
      comment(' Comment 4'),
      EOF
    ]
  ],
  [
    'lex a grammatically invalid sequence of tokens without error',
    'AND ) OR first NOT ) ( "second"',
    [AND, CLOSE, OR, FIRST, NOT, CLOSE, OPEN, SECOND, EOF]
  ],
  [
    'return a single identifer when no special characters are found',
    'firstANDsecondORthird',
    [id('firstANDsecondORthird'), EOF]
  ]
];

export const unhappyTests: [string, string, string][] = [
  [
    'throw on an unterminated quoted identifier',
    '"first AND second',
    'Unexpected end of expression: expected " character'
  ],
  [
    'throw if quoted identifier is not followed by separator or structural character',
    '"first"#',
    'Unexpected character: # Expected ) character or separator'
  ],
  [
    'throw if " character is found in an unquoted identifier',
    'abc"de',
    'Unexpected character: "'
  ],
  [
    'throw if # character is found in an unquoted identifier',
    'abc#de',
    'Unexpected character: #'
  ],
  [
    'throw if operator is not followed by a separator',
    'AND(',
    'Unexpected character: ('
  ],
  [
    'throw if closing parenthesis is not followed by an operator',
    ')OR',
    'Unexpected character: O. A closing parenthesis should be followed by another closing parenthesis or whitespace'
  ]
];
