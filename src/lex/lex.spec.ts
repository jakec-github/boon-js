import { lex } from './lex';
import { LexToken, Tokens } from '../types';

const withAndOperator = 'first AND second';
const withParentheses = '(first AND second) OR third';
const withMultipleOperators = 'first AND (second OR third) AND fourth OR five';
const withNestedParentheses = '(first OR (second AND third)) AND fourth';
const withMultipleParentheses = '(first OR second) AND (third OR fourth)';
const withNotOperator = '(first AND NOT second) OR third';
const withMultipleNotOperators = 'NOT first AND second AND NOT third OR fourth';
const withMultipleNestedNotOperators = 'first AND (NOT second OR NOT third)';
const withSpacedParentheses = 'first AND NOT ( second OR third )';
const withXorOperator = 'first XOR second';
const withXorAndNotOperator = 'first XOR NOT second';

// NEED TO add a test case where the string is written over multiple lines

describe('lex', () => {
  // This test is only a temporary one
  test('should be able to lex a range of expressions', () => {
    let remainingString = withNestedParentheses;
    let tokenArray: LexToken[] = [];
    while (remainingString) {
      const result = lex(remainingString);
      remainingString = result.remainingString;
      tokenArray = [...tokenArray, result.token];
    }
    // expect(tokenArray).toEqual([
    //   { type: Tokens.VARIABLE, value: 'first' },
    //   { type: Tokens.OPERATOR, value: 'AND' },
    //   { type: Tokens.VARIABLE, value: 'second' },
    // ]);
    expect(tokenArray).toEqual([
      { type: Tokens.OPEN_PARENTHESIS },
      { type: Tokens.VARIABLE, value: 'first' },
      { type: Tokens.OPERATOR, value: 'OR' },
      { type: Tokens.OPEN_PARENTHESIS },
      { type: Tokens.VARIABLE, value: 'second' },
      { type: Tokens.OPERATOR, value: 'AND' },
      { type: Tokens.VARIABLE, value: 'third' },
      { type: Tokens.CLOSE_PARENTHESIS },
      { type: Tokens.CLOSE_PARENTHESIS },
      { type: Tokens.OPERATOR, value: 'AND' },
      { type: Tokens.VARIABLE, value: 'fourth' },
    ]);
  });
});
