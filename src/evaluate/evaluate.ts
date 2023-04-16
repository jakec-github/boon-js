import { parse } from '../parse/parse';
import { BooleanMap, PostfixExpression, Tokens, Operators } from '../types';

import { OPERATOR_MAP } from './const';
import {
  isIdentifier,
  isOperator,
  notUtil,
  throwInvalidExpression,
} from './utils';

type EvaluatorFunction = (booleanMap: BooleanMap) => boolean;

export const getEvaluator = (expression: string): EvaluatorFunction => {
  const parsedExpression = parse(expression);

  return (booleanMap) => evaluate(parsedExpression, booleanMap);
};

export const evaluate = (
  expression: PostfixExpression,
  booleanMap: BooleanMap
): boolean => {
  if (!Array.isArray(expression)) {
    throw new Error(
      `${expression} should be an array. evaluate takes in a parsed expression. Use in combination with parse or use getEvaluator`
    );
  }

  // Resolves each identifier and adds it to a stack
  // When operator is found it operates on the top value(s)
  // on the stack, removes them and replaces them with the
  // result
  const evaluatedExpression = expression.reduce<boolean[]>(
    (stack, token, i) => {
      if (!(token && (isIdentifier(token) || isOperator(token)))) {
        throw new Error(
          `Invalid token: ${token}. Found in parsed expression at index ${i}`
        );
      }
      if (token.name === Tokens.IDENTIFIER) {
        return [...stack, Boolean(booleanMap[token.value])];
      }
      const secondLastItem = stack[stack.length - 2];
      const lastItem = stack[stack.length - 1];

      if (token.value === Operators.NOT) {
        if (lastItem === undefined) {
          throwInvalidExpression('missing identifier');
        }

        return [...stack.slice(0, -1), notUtil(lastItem)];
      }

      if (lastItem === undefined || secondLastItem === undefined) {
        throwInvalidExpression('missing identifier');
      }

      const operatorUtil = OPERATOR_MAP[token.value];

      if (!operatorUtil) {
        throwInvalidExpression('unknown operator');
      }

      return [...stack.slice(0, -2), operatorUtil(secondLastItem, lastItem)];
    },
    []
  );

  if (evaluatedExpression.length !== 1) {
    throwInvalidExpression('too many identifiers after evaluation');
  }

  return evaluatedExpression[0];
};

export const evaluateExpression = (
  expression: string,
  booleanMap: BooleanMap
): boolean => getEvaluator(expression)(booleanMap);
