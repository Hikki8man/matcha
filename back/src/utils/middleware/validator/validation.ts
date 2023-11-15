import { ValidatorFunction } from '../../../types/validator';
import { Builder } from './builder';

export class Validation {
  message: string = 'Invalid value';

  constructor(private readonly validator: ValidatorFunction) {}

  async run(builder: Builder, value: any) {
    try {
      const result = await this.validator(value);
      // console.log(
      //   'Result of',
      //   builder.field,
      //   ": value: '" + value + "' valid:",
      //   result,
      // );
      if (!result) {
        builder.addError(this.message);
      }
    } catch (err) {
      builder.addError(err instanceof Error ? err.message : this.message);
    }
  }
}
