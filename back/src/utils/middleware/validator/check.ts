import { Location } from '../../../types/validator';
import { bindAll } from './bindAll';
import { Builder } from './builder';
import { ValidationChain } from './validationChain';
import { Validators } from './validators';

export function check(field: string, location: Location): ValidationChain {
  const builder = new Builder(field, location);
  const middleware = async (req: any, _res: any, next: (err?: any) => void) => {
    try {
      await builder.run(req);
      next();
    } catch (e) {
      next(e);
    }
  };
  return Object.assign(
    middleware,
    bindAll(new Validators(builder, middleware as any)),
    // { builder },
  );
}

export const body = (field: string) => check(field, 'body');

export const param = (field: string) => check(field, 'params');
