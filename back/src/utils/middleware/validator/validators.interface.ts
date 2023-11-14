import { MinMaxOptions, ValidatorFunction } from '../../../types/validator';

export interface IValidators<Return> {
  custom(validator: ValidatorFunction): Return;
  withMessage(message: string): Return;
  isString(): Return;
  isEmail(): Return;
  isInt(): Return;
  isLength(options: MinMaxOptions): Return;
  isDate(): Return;
}
