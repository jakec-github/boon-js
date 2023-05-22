import {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  AND,
  NOT,
  XOR,
  OR
} from '../testConst';
import { PostfixExpression } from '../types';

export const basic: [string, string, PostfixExpression][] = [
  ['lone identifier', 'first', [FIRST]],
  ['simple expression', 'first AND second', [FIRST, SECOND, AND]],
  ['NOT operator', 'NOT first', [FIRST, NOT]]
];

export const operatorPrecedence: [string, string, PostfixExpression][] = [
  ['AND then OR', 'first AND second OR third', [FIRST, SECOND, AND, THIRD, OR]],
  [
    'AND then AND',
    'first AND second AND third',
    [FIRST, SECOND, AND, THIRD, AND]
  ],
  ['OR then OR', 'first OR second OR third', [FIRST, SECOND, OR, THIRD, OR]],
  ['OR then AND', 'first OR second AND third', [FIRST, SECOND, THIRD, AND, OR]],
  [
    'XOR, AND then OR',
    'first XOR second AND third OR fourth',
    [FIRST, SECOND, XOR, THIRD, AND, FOURTH, OR]
  ],
  [
    'AND, XOR then OR',
    'first AND second XOR third OR fourth',
    [FIRST, SECOND, THIRD, XOR, AND, FOURTH, OR]
  ],
  ['XOR then OR', 'first XOR second OR third', [FIRST, SECOND, XOR, THIRD, OR]],
  [
    'XOR then AND',
    'first XOR second AND third',
    [FIRST, SECOND, XOR, THIRD, AND]
  ],
  [
    'OR, AND then XOR',
    'first OR second AND third XOR fourth',
    [FIRST, SECOND, THIRD, FOURTH, XOR, AND, OR]
  ],
  [
    'OR, XOR then AND',
    'first OR second XOR third AND fourth',
    [FIRST, SECOND, THIRD, XOR, FOURTH, AND, OR]
  ],
  [
    'OR, XOR, AND with some NOT operators',
    'first OR NOT second XOR third AND NOT fourth',
    [FIRST, SECOND, NOT, THIRD, XOR, FOURTH, NOT, AND, OR]
  ]
];

export const parentheses: [string, string, PostfixExpression][] = [
  ['around a single identifier', '(first)', [FIRST]],
  ['around a NOT operator', '(NOT first)', [FIRST, NOT]],
  [
    'around an operator with lower precedence',
    '(first AND second) OR third',
    [FIRST, SECOND, AND, THIRD, OR]
  ],
  [
    'at the end of an expression',
    'first AND (second OR third)',
    [FIRST, SECOND, THIRD, OR, AND] // Curious to see if this is right
  ],
  [
    'in the middle of an expression',
    'first XOR (second AND third) OR fourth',
    [FIRST, SECOND, THIRD, AND, XOR, FOURTH, OR]
  ],
  ['nested', '((first))', [FIRST]],
  [
    'complex nested',
    '((first AND second) OR third)',
    [FIRST, SECOND, AND, THIRD, OR]
  ],
  [
    'long complex nested',
    'NOT ((first OR second) AND NOT third) XOR (NOT fourth AND fifth)',
    [FIRST, SECOND, OR, THIRD, NOT, AND, NOT, FOURTH, NOT, FIFTH, AND, XOR]
  ]
];

export const comments: [string, string, PostfixExpression][] = [
  ['Removes trailing comment', 'NOT first # comment', [FIRST, NOT]],
  ['Removes leading comment', '# comment\nNOT first', [FIRST, NOT]],
  [
    'Removes subsequent comments',
    '# comment 1\n# comment 2\nNOT first # comment 3\n# comment 4',
    [FIRST, NOT]
  ],
  [
    'Removes comments wherever they appear in the expression',
    `# Comment
      NOT # Comment
      ( # Comment
        first # Comment
        AND # Comment
        second # Comment
      ) # Comment`,
    [FIRST, SECOND, AND, NOT]
  ]
];

export const complex: [string, string, PostfixExpression][] = [
  [
    'multiple NOT operators',
    'NOT first AND second AND NOT third XOR NOT fourth',
    [FIRST, NOT, SECOND, AND, THIRD, NOT, FOURTH, NOT, XOR, AND]
  ],
  [
    'multiple NOT operators and parentheses',
    'NOT (first AND second AND NOT third) XOR (NOT fourth XOR fifth)',
    [FIRST, SECOND, AND, THIRD, NOT, AND, NOT, FOURTH, NOT, FIFTH, XOR, XOR]
  ]
];

export const unhappyPath: [string, string, string][] = [
  ['out of order identifiers', 'AND first second', 'Invalid token'],
  ['missing second identifier', 'first AND', 'Unexpected end of expression'],
  ['missing first identifier', 'AND second', 'Invalid token'],
  ['repeated operator', 'first AND AND second', 'Invalid token'],
  ['hanging AND', 'first OR second AND', 'Unexpected end of expression'],
  ['two NOT operators in a row', 'NOT NOT first', 'Invalid token'],
  ['lone NOT operator', 'NOT', 'Unexpected end of expression'],
  [
    'lone nested NOT operator',
    '(NOT)',
    'Unexpected character: ). Operators should be separated using whitespace'
  ],
  [
    'too many closing parentheses',
    'NOT ((first OR second) AND NOT third))',
    'Invalid token'
  ],
  [
    'too many opening parentheses',
    'NOT (((first OR second) AND NOT third)',
    'Unexpected end of expression'
  ],
  ['open parenthesus follows an identifier', 'first (', 'Invalid token'],
  ['empty expression', '', 'Unexpected end of expression'],
  ['expression with onlu whitespace', ' ', 'Unexpected end of expression'],
  [
    'expression with only a comment',
    '# comment',
    'Unexpected end of expression'
  ],
  ['non-string argument', null as string, 'Expected string but received object']
];
