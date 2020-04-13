import { parse } from '../parse/parse';
import { BooleanMap, PostfixExpression, Tokens, Operators } from '../types';

import { OPERATOR_MAP } from './const';
import { notUtil } from './utils';

type EvaluatorFunction = (booleanMap: BooleanMap) => boolean;

// Dear god come up with a better name for this function before exporting publically
export const getEvaluator = (expression: string): EvaluatorFunction => {
  const parsedExpression = parse(expression);

  return booleanMap => evaluate(parsedExpression, booleanMap);
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
    const [secondLastItem, lastItem] = acc.slice(-2);
    return token.value === Operators.NOT
      ? [...acc.slice(0, -1), notUtil(lastItem)]
      : [
          ...acc.slice(0, -2),
          OPERATOR_MAP[token.value](secondLastItem, lastItem),
        ];
  }, [])[0];
};
