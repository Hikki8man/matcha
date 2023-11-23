import { IValidators } from './validators.interface';
import { Builder } from './builder';
import { Request } from 'express';

export interface ValidationChain extends IValidators<ValidationChain> {
  (req: Request, res: any, next: (error?: any) => void): void;
  //   builder: Builder;
}
