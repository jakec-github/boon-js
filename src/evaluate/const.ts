import { Operators } from '../types';

import { andUtil, orUtil, xorUtil } from './utils';

export const OPERATOR_MAP = {
  [Operators.AND]: andUtil,
  [Operators.OR]: orUtil,
  [Operators.XOR]: xorUtil,
};
