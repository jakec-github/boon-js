import { lex } from '../lex/lex';
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
  validateToken,
} from './utils';

// TODO: Must make sure to test an expression ending in a close parenthesis
export const parse = (expression: string): PostfixExpression =>
  parseInternal(expression)[0];

const parseInternal = (
  expression: string,
  nested = false,
): [PostfixExpression, string] => {
  // This gets weird when we go recursive so intend to remove
  let remainingExpression = expression;

  // This should be a generic for full type safety
  const getNextToken = (expectedTokenSet: TokenSets): Token => {
    if (!remainingExpression) {
      throw new Error('Unexpected end of expression');
    }
    const { token, remainingString } = lex(remainingExpression);
    remainingExpression = remainingString;

    validateToken(token, expectedTokenSet);

    return token;
  };

  const getValue = (): PostfixExpression => {
    const nextToken = getNextToken(TokenSets.OPERAND_OR_NOT);

    if (nextToken.name === Tokens.SPECIAL_CHARACTER) {
      let value: PostfixExpression;
      [value, remainingExpression] = parseInternal(remainingExpression, true);
      return value;
    }

    if (nextToken.value === Operators.NOT) {
      const tokenAfterNot = getNextToken(TokenSets.OPERAND);
      if (tokenAfterNot.name === Tokens.SPECIAL_CHARACTER) {
        let valueInner: PostfixExpression;
        [valueInner, remainingExpression] = parseInternal(
          remainingExpression,
          true,
        );
        return [...valueInner, nextToken];
      }

      return [tokenAfterNot, nextToken];
    }
    return [nextToken];
  };

  let output: PostfixExpression = [...getValue()];
  let operators: OperatorStack = [];

  while (remainingExpression) {
    const tokenSet = nested ? TokenSets.OPERATOR_OR_CLOSE : TokenSets.OPERATOR;
    const nextToken = getNextToken(tokenSet);

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
