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
  cloneExpression,
  getPathToLastValue,
  resolvePath,
  validateToken,
  previousOperatorTakesPrecedent,
} from './utils';

// Ultimately we will only return part of the recursive response
// Also the recursive parse defintely doesn't need to recurse.
// Can easily avoid the stack overflow issues
export const parse = (expression: string): ParsedExpression =>
  recursiveParse(expression);

const recursiveParse = (
  remainingExpression: string,
  currentParsedExpression: ParsedExpression = null,
  nested = false,
): ParsedExpression => {
  let remainingExpressionInner = remainingExpression;
  // console.log(remainingExpressionInner);

  // Would like to get a little more functional here and declare elsewhere and remove the let
  // on remainingExpressionInner
  const getNextToken = (expectedTokenSet: TokenSet): LexToken => {
    if (!remainingExpressionInner) {
      throw new Error('Unexpected end of expression');
    }
    const { token, remainingString } = lex(remainingExpressionInner);
    remainingExpressionInner = remainingString;
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

  if (!currentParsedExpression) {
    const latestExpression: ParsedExpression = getValue();

    if (remainingExpressionInner) {
      console.log(`Recursing with: ${remainingExpressionInner}`);
      return recursiveParse(remainingExpressionInner, latestExpression);
    }
    return latestExpression;
  }

  const nextOperator = getOperator();
  const nextVariable = getValue();

  // Probably want to improve this naming
  // Also the whole path thing should mayve just be an array of references
  // to objects/values within the AST that I need
  let pathToLastValue = getPathToLastValue(currentParsedExpression);

  let afterAddingNextVariable = {} as ParsedExpression;

  let count = 0;

  while (true && count < 10) {
    console.log(pathToLastValue);
    count++;
    if (pathToLastValue.length === 1) {
      afterAddingNextVariable = {
        value: {
          left: currentParsedExpression,
          right: nextVariable,
          operator: nextOperator,
        },
        inverted: false,
      };
      break;
    }

    const pathToLastParsedOperator = pathToLastValue.slice(0, -2);
    const lastParsedOperator: ParsedOperator = resolvePath(
      currentParsedExpression,
      pathToLastParsedOperator,
    );
    const lastOperator = lastParsedOperator.operator;

    console.log(currentParsedExpression);
    console.log(pathToLastValue);
    console.log(pathToLastParsedOperator);

    if (previousOperatorTakesPrecedent(lastOperator, nextOperator)) {
      pathToLastValue = pathToLastParsedOperator;
    } else {
      // Will have to mutate the exisiting object
      // Feel this is another reason not to go recursive
      const currentParsedExpressionCopy = cloneExpression(
        currentParsedExpression,
      );

      let lastOperatorParentCopy: ParsedOperator = resolvePath(
        currentParsedExpressionCopy,
        pathToLastParsedOperator,
      );

      lastOperatorParentCopy.right = {
        value: {
          left: lastOperatorParentCopy.right,
          right: nextVariable,
          operator: nextOperator,
        },
        inverted: false,
      };

      afterAddingNextVariable = currentParsedExpressionCopy;
      break;
    }
  }

  if (remainingExpressionInner) {
    console.log(`Recursing2 with: ${remainingExpressionInner}`);
    return recursiveParse(remainingExpressionInner, afterAddingNextVariable);
  }
  return afterAddingNextVariable;
};
