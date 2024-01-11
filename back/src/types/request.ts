import { Request } from 'express';
import { Profile } from './profile';
import { ParamsDictionary } from 'express-serve-static-core';

export interface MyRequest extends Request {
  params: ParamsDictionary & { id?: number };
  user_id?: number;
  profile?: Profile;
}
