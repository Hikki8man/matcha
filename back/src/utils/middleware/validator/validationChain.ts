import { Request } from 'express';
import { IValidators } from './validators.interface';

export interface ValidationChain extends IValidators<ValidationChain> {
  (req: Request, res: any, next: (error?: any) => void): void;
}
