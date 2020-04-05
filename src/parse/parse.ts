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
  getPathToLastValue,
  resolvePath,
  validateToken,
  previousOperatorTakesPrecedent,
} from './utils';

// export const parse = (expression: string): ParsedExpression =>
//   recursiveParse(expression);

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
    let pathToPreviousValue = getPathToLastValue(currentParsedExpression);

    while (true) {
      // Potentially is possible to generalise so that this branch is necessary\
      if (pathToPreviousValue.length === 1) {
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
      pathToPreviousValue = pathToPreviousValue.slice(0, -2);

      // This is really nasty non-typesafe stuff we don't want
      const lastValue: ParsedOperator = resolvePath(
        currentParsedExpression,
        pathToPreviousValue,
      );

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
