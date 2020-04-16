import { Token, Tokens } from '../types';

import { lex } from './lex';

export const lexEntireExpression = (expression: string) => {
  let remainingString = expression;
  let tokenArray: Token[] = [];
  while (true) {
    const result = lex(remainingString);
    remainingString = result.remainingString;
    tokenArray = [...tokenArray, result.token];
    if (result.token.name === Tokens.EOF) {
      break;
    }
  }

  return tokenArray;
};
