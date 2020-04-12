import { Operators } from '../types';

import { andUtil, orUtil, xorUtil, OperatorUtil } from './utils';

export const OPERATOR_MAP: Record<string, OperatorUtil> = {
  [Operators.AND]: andUtil,
  [Operators.OR]: orUtil,
  [Operators.XOR]: xorUtil,
};
