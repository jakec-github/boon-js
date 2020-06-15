import { Token, Tokens } from '../types';

export type OperatorUtil = (left: boolean, right: boolean) => boolean;

export const andUtil: OperatorUtil = (left, right) => left && right;
export const orUtil: OperatorUtil = (left, right) => left || right;
export const xorUtil: OperatorUtil = (left, right) => !(left === right);
export const notUtil = (identifier: boolean): boolean => !identifier;

export const isIdentifier = ({ name, value }: Token): boolean =>
  name === Tokens.IDENTIFIER && typeof value === 'string';

export const isOperator = ({ name, value }: Token): boolean =>
  name === Tokens.OPERATOR && typeof value === 'string';

export const throwInvalidExpression = (message: string): never => {
  throw new TypeError(`Invalid postfix expression: ${message}`);
};
