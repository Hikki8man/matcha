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

  optional() {
    this.builder.setOptional(true);
    return this.chain;
  }

  isString() {
    return this.custom((value) => typeof value === 'string');
  }

  isInt() {
    return this.custom((value) => Number.isInteger(value));
  }

  isNumeric() {
    return this.custom((value) => !isNaN(parseFloat(value)) && isFinite(value));
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
    const iso8601Regex =
      /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2})(\.\d{1,}))?(Z|([+-]\d{2}):(\d{2}))?$/;

    return this.custom((value) => {
      return iso8601Regex.test(value);
    });
  }

  isEmail() {
    const emailRegex = /\S+@\S+\.\S+/;
    return this.custom((value) => emailRegex.test(value));
  }

  notEmpty() {
    return this.custom((value) => value.length > 0);
  }

  exists() {
    return this.custom((value) => (value ? true : false));
  }

  isArray() {
    return this.custom((value) => Array.isArray(value));
  }

  isStrongPassword() {
    const passRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return this.custom((value) => passRegex.test(value));
  }
}
