export type ValidatorFunction = (value: any) => boolean | Promise<boolean>;

export interface ValidationError {
  field: string;
  msg: string;
}

export type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';

export interface MinMaxOptions {
  min?: number;
  max?: number;
}
