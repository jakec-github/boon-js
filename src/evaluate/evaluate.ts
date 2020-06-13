import { parse } from '../parse/parse';
import { BooleanMap, PostfixExpression, Tokens, Operators } from '../types';

import { OPERATOR_MAP } from './const';
import { notUtil } from './utils';

type EvaluatorFunction = (booleanMap: BooleanMap) => boolean;

export const getEvaluator = (expression: string): EvaluatorFunction => {
  const parsedExpression = parse(expression);

  return (booleanMap) => evaluate(parsedExpression, booleanMap);
};

export const evaluate = (
  expression: PostfixExpression,
  booleanMap: BooleanMap,
): boolean => {
  if (!Array.isArray(expression)) {
    throw new Error(
      `${expression} should be an array. evaluate takes in a parsed expression. Use in combination with parse or use getEvaluator`,
    );
  }

  // Evaluates each boolean and adds it to a stack
  // When operand is found it operates on the top value(s)
  // on the stack, removes them and replaces them with the
  // result
  return expression.reduce<boolean[]>((acc, token, i) => {
    if (
      !token ||
      typeof token.name !== 'string' ||
      typeof token.value !== 'string'
    ) {
      throw new Error(
        `Invalid token: ${token}. Found in parsed expression at index ${i}`,
      );
    }
    if (token.name === Tokens.OPERAND) {
      return [...acc, Boolean(booleanMap[token.value])];
    }
    const secondLastItem = acc[acc.length - 2];
    const lastItem = acc[acc.length - 1];

    return token.value === Operators.NOT
      ? [...acc.slice(0, -1), notUtil(lastItem)]
      : [
          ...acc.slice(0, -2),
          OPERATOR_MAP[token.value](secondLastItem, lastItem),
        ];
  }, [])[0];
};
