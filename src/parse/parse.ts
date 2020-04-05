import { lex } from '../lex/lex';
import {
  Operators,
  ParsedExpression,
  TokenSet,
  LexToken,
  ParsedOperator,
} from '../types';

import { TOKEN_SETS } from './const';
import {
  validateToken,
  previousOperatorTakesPrecedent,
  getPreviousValues,
} from './utils';

export const parse = (expression: string): ParsedExpression => {
  let remainingExpression = expression;

  // Would like to get a little more functional here and declare elsewhere and remove the let
  // on remainingExpressionInner
  const getNextToken = (expectedTokenSet: TokenSet): LexToken => {
    if (!remainingExpression) {
      throw new Error('Unexpected end of expression');
    }
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;
    validateToken(token.type, expectedTokenSet);
    return token;
  };

  // This will later handle potential parentheses and negations
  const getValue = (): ParsedExpression => {
    const { value } = getNextToken(TOKEN_SETS.variable);

    return {
      value,
      inverted: false,
    };
  };
  const getOperator = (): Operators => {
    const { subType } = getNextToken(TOKEN_SETS.operator);
    return subType;
  };

  let currentParsedExpression = getValue();

  while (remainingExpression) {
    const nextOperator = getOperator();
    const nextVariable = getValue();

    // This path thing needs to get replaced with a reference to all the previous (right side) values
    // let pathToPreviousValue = getPathToLastValue(currentParsedExpression);
    let previousValues = getPreviousValues(currentParsedExpression);

    while (true) {
      // Potentially is possible to generalise so that this branch isn't necessary
      // TO UNDERSTAND: this seem to assume that the previous operator takes precendent
      if (previousValues.length === 1) {
        currentParsedExpression = {
          value: {
            left: currentParsedExpression,
            right: nextVariable,
            operator: nextOperator,
          },
          inverted: false,
        };
        break;
      }

      // This seems weird cause we didn't really use this much before slicing
      previousValues = previousValues.slice(1);

      const lastValue = previousValues[0] as ParsedOperator;
      const lastOperator = lastValue.operator;

      if (!previousOperatorTakesPrecedent(lastOperator, nextOperator)) {
        lastValue.right = {
          value: {
            left: lastValue.right,
            right: nextVariable,
            operator: nextOperator,
          },
          inverted: false,
        };
        break;
      }
    }
  }

  return currentParsedExpression;
};
