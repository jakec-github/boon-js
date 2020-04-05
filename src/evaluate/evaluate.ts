import { parse } from '../parse/parse';
import { ParsedExpression } from '../types';

import { OPERATOR_MAP } from './const';

type BooleanMap = Record<string, boolean>;
type EvaluatorFunction = (booleanMap: BooleanMap) => boolean;

// Dear god come up with a better name for this function
export const getEvaluator = (expression: string): EvaluatorFunction => {
  const parsedExpression = parse(expression);

  return booleanMap => evaluateExpression(parsedExpression, booleanMap);
};

export const evaluateExpression = (
  { value, inverted }: ParsedExpression,
  booleanMap: BooleanMap,
): boolean => {
  let evaluatedValue: boolean;

  if (typeof value === 'string') {
    evaluatedValue = booleanMap[value];
  } else {
    const operatorFunction = OPERATOR_MAP[value.operator];

    return operatorFunction(
      evaluateExpression(value.left, booleanMap),
      evaluateExpression(value.right, booleanMap),
    );
  }

  return inverted ? !evaluatedValue : evaluatedValue;
};
