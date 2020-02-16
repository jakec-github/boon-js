import { Operators } from '../types';

import { andUtil, orUtil, xorUtil } from './utils';

export const operatorMap = {
  [Operators.AND]: andUtil,
  [Operators.OR]: orUtil,
  [Operators.XOR]: xorUtil,
};
