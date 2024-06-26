import { Location, ValidationError } from '../../../types/validator';
import { Validation } from './validation';

export class Builder {
  private validations: Validation[] = [];
  private errors: ValidationError[] = [];
  private optional: boolean = false;

  constructor(
    private field: string,
    private location: Location,
  ) {}

  addValidator(validator: Validation) {
    this.validations.push(validator);
  }

  isOptional() {
    return this.optional;
  }

  setOptional(value: boolean) {
    this.optional = value;
  }

  addError(message: string) {
    this.errors.push({ field: this.field, msg: message });
  }

  async run(req: any) {
    const value = req[this.location][this.field];
    for (const validation of this.validations) {
      await validation.run(this, value);
      if (this.errors.length) {
        break;
      }
    }
    if (req.errors) {
      req.errors = req.errors.concat(this.errors);
    } else {
      req.errors = this.errors;
    }
    this.errors = [];
  }
}
