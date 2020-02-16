type OperatorUtil = (left: boolean, right: boolean) => boolean;

export const andUtil: OperatorUtil = (left, right) => left && right;
export const orUtil: OperatorUtil = (left, right) => left || right;
export const xorUtil: OperatorUtil = (left, right) => !(left === right);
