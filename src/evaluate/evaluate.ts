import { parse } from '../parse/parse';
import { ParsedExpression } from '../types';

import { operatorMap } from './const';

type BooleanMap = Record<string, boolean>;
type EvaluatorFunction = (BooleanMap) => boolean;

// Dear god come up with a better name for this function
export const getEvaluator = (expression: string): EvaluatorFunction => {
  const parsedExpression = parse(expression);

  return booleanMap => evaluateExpression(parsedExpression, booleanMap);
};

export const evaluateExpression = (
  { left, right, operator }: ParsedExpression,
  booleanMap: BooleanMap,
) => {
  let operatorFunction = operatorMap[operator];

  const [evaluatedLeft, evaluatedRight] = [left, right].map(
    ({ value, inverted }) => {
      let evaluatedSide: boolean = null;

      if (typeof value === 'string') {
        evaluatedSide = booleanMap[value];
      } else {
        evaluatedSide = evaluateExpression(value, booleanMap);
      }

      return inverted ? !evaluatedSide : evaluatedSide;
    },
  );

  return operatorFunction(evaluatedLeft, evaluatedRight);
};
