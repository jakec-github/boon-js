import { lex } from '../lex/lex';
import {
  Operators,
  ParsedExpression,
  TokenSet,
  LexToken,
  ParsedOperator,
  PostfixExpression,
  OperatorStack,
  Symbol,
  Tokens,
  PostfixTypes,
  OperatorSymbol,
} from '../types';

import { TOKEN_SETS } from './const';
import {
  validateToken,
  previousOperatorTakesPrecedent,
  getPreviousValues,
} from './utils';

export const parsePostfix = (expression: string): PostfixExpression => {
  let remainingExpression = expression;
  let peakedTokens: PostfixExpression = [];

  // Would like to get a little more functional here and declare elsewhere and remove the let
  // on remainingExpressionInner
  const getNextToken = (expectedTokenSet: TokenSet, peak = false): Symbol => {
    if (peakedTokens.length) {
      const [result, ...otherPeakedTokens] = peakedTokens;
      peakedTokens = otherPeakedTokens;
      return result;
    }

    if (!remainingExpression) {
      throw new Error('Unexpected end of expression');
    }
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;
    validateToken(token.type, expectedTokenSet);

    if (token.type === Tokens.VARIABLE) {
      const result: Symbol = {
        type: PostfixTypes.OPERAND,
        value: token.value,
      };
      peak ? [...peakedTokens, result] : peakedTokens;
      return result;
    } else if (token.type === Tokens.OPERATOR) {
      const result = {
        type: PostfixTypes.OPERATOR,
        value: token.subType,
      };
      peak ? [...peakedTokens, result] : peakedTokens;
      return result;
    } else {
      // Will handle parentheses here
      throw new Error('Unimplemented');
    }
  };

  // This will later handle potential parentheses and negations
  const getValue = (peak = false): PostfixExpression => [
    getNextToken(TOKEN_SETS.variable, peak),
  ];

  // This type casting should be solvable when types are sorted using a generic
  const getOperator = (peak = false): OperatorSymbol =>
    getNextToken(TOKEN_SETS.operator, peak) as OperatorSymbol;

  let outputStack: PostfixExpression = [...getValue()];
  let operatorStack: OperatorStack = [];

  while (remainingExpression) {
    const nextOperator = getOperator();
    const previousOperator = operatorStack[operatorStack.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(previousOperator.value, nextOperator.value)
    ) {
      outputStack = [...outputStack, ...operatorStack.reverse()]; // Disgusting mutating method
      operatorStack = [];
    }
    operatorStack = [...operatorStack, nextOperator];
    outputStack = [...outputStack, ...getValue()];
  }

  outputStack = [...outputStack, ...operatorStack.reverse()]; // Disgusting mutating method

  return outputStack;
};
