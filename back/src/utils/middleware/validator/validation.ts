import { ValidatorFunction } from '../../../types/validator';
import { Builder } from './builder';

export class Validation {
  message: string = 'Invalid value';

  constructor(private readonly validator: ValidatorFunction) {}

  async run(builder: Builder, value: any) {
    try {
      let can_fail = false;
      if (builder.isOptional() && (value === undefined || value === null)) {
        can_fail = true;
      }
      const result = await this.validator(value);
      if (!result && !can_fail) {
        builder.addError(this.message);
      }
    } catch (err) {
      builder.addError(err instanceof Error ? err.message : this.message);
    }
  }
}
