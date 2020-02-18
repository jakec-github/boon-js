import { LexToken } from '../types';

import { lex } from './lex';

export const lexEntireExpression = (expression: string) => {
  let remainingString = expression;
  let tokenArray: LexToken[] = [];
  while (remainingString) {
    const result = lex(remainingString);
    remainingString = result.remainingString;
    tokenArray = [...tokenArray, result.token];
  }

  return tokenArray;
};
