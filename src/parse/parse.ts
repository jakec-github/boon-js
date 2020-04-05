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

  // This object may be mutated as the expression is constructed
  // It is returned when completed
  let parsedExpression = getValue();

  while (remainingExpression) {
    const nextOperator = getOperator();
    const nextVariable = getValue();

    let previousValues = getPreviousValues(parsedExpression);

    while (true) {
      const noPreviousValuesTakePrecendent = previousValues.length === 0;
      if (noPreviousValuesTakePrecendent) {
        parsedExpression = {
          value: {
            left: parsedExpression,
            right: nextVariable,
            operator: nextOperator,
          },
          inverted: false,
        };
        break;
      }

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
      } else {
        previousValues = previousValues.slice(1);
      }
    }
  }

  return parsedExpression;
};
