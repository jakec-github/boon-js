import {
  TokenSets,
  Token,
  PostfixExpression,
  OperatorStack,
  OperatorToken,
  Operators,
  Tokens,
} from '../types';

import {
  addOperatorsToOutput,
  previousOperatorTakesPrecedent,
  getNextToken,
} from './utils';

export const parse = (expression: string): PostfixExpression => {
  if (typeof expression !== 'string') {
    throw new Error(`Expected string but received ${typeof expression}`);
  }

  return parseInternal(expression)[0];
};

const parseInternal = (
  expression: string,
  nested = false,
): [PostfixExpression, string] => {
  let remainingExpression = expression;

  const getValue = (): PostfixExpression => {
    let value: PostfixExpression;
    let nextToken: Token;
    [nextToken, remainingExpression] = getNextToken(
      TokenSets.OPERAND_OR_NOT,
      remainingExpression,
    );
    let negatedValue = nextToken.value === Operators.NOT;
    if (negatedValue) {
      [nextToken, remainingExpression] = getNextToken(
        TokenSets.OPERAND,
        remainingExpression,
      );
    }

    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      [value, remainingExpression] = parseInternal(remainingExpression, true);
    } else {
      value = [nextToken];
    }

    return negatedValue
      ? [...value, { name: Tokens.OPERATOR, value: Operators.NOT }]
      : value;
  };

  let output: PostfixExpression = [...getValue()];
  let operators: OperatorStack = [];

  while (remainingExpression) {
    const tokenSet = nested ? TokenSets.OPERATOR_OR_CLOSE : TokenSets.OPERATOR;
    let nextToken: Token;
    [nextToken, remainingExpression] = getNextToken(
      tokenSet,
      remainingExpression,
    );

    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      [output, operators] = addOperatorsToOutput(output, operators);
      return [output, remainingExpression];
    }
    // This type casting should be solvable using a generic
    const nextOperator = nextToken as OperatorToken;

    const previousOperator = operators[operators.length - 1] || null;
    if (
      previousOperator &&
      previousOperatorTakesPrecedent(previousOperator.value, nextOperator.value)
    ) {
      [output, operators] = addOperatorsToOutput(output, operators);
    }
    operators = [...operators, nextOperator];
    output = [...output, ...getValue()];
  }

  [output, operators] = addOperatorsToOutput(output, operators);
  return [output, null];
};
