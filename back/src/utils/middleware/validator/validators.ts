import { MinMaxOptions, ValidatorFunction } from '../../../types/validator';
import { Builder } from './builder';
import { Validation } from './validation';
import { IValidators } from './validators.interface';

export class Validators<Chain> implements IValidators<Chain> {
  private lastValidator: Validation | undefined;

  constructor(
    private readonly builder: Builder,
    private readonly chain: Chain,
  ) {}

  private addValidator(item: Validation) {
    this.builder.addValidator(item);
    this.lastValidator = item;
    return this.chain;
  }

  withMessage(message: string) {
    if (this.lastValidator) {
      this.lastValidator.message = message;
    }
    return this.chain;
  }

  custom(validator: ValidatorFunction) {
    return this.addValidator(new Validation(validator));
  }

  isString() {
    return this.custom((value) => typeof value === 'string');
  }

  isInt() {
    return this.custom((value) => Number.isInteger(value));
  }

  isLength(options: MinMaxOptions) {
    const { min, max } = options;

    return this.custom((value) => {
      if (!value) {
        return false;
      }
      if (min && value.length < min) {
        return false;
      }
      if (max && value.length > max) {
        return false;
      }
      return true;
    });
  }

  isDate() {
    return this.custom((value) => {
      if (!value) {
        return false;
      }
      return value.isDate();
    });
  }

  isEmail() {
    const emailRegex = /\S+@\S+\.\S+/;
    return this.custom((value) => emailRegex.test(value));
  }
}
