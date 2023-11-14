// import { Request, Response, NextFunction } from 'express';

// type ValidatorFunction = (value: any) => boolean | Promise<boolean>;
// export type Location = 'body' | 'cookies' | 'headers' | 'params' | 'query';

// export interface MinMaxOptions {
//   min?: number;
//   max?: number;
// }

// interface ValidationError {
//   field: string;
//   msg: string;
// }

// export interface ValidationRule {
//   validator: ValidatorFunction;
//   message: string;
// }

// export interface IValidators {
//   custom(validator: ValidationRule): ValidationRule;
//   isString(): ValidationRule;
//   isEmail(): ValidationRule;
// }

// export const check =
//   (location: Location) => (fieldName: string, validators: ValidationRule[]) => {
//     const middleware = async (
//       req: any,
//       _res: any,
//       next: (err?: any) => void,
//     ) => {
//       try {
//         let errors: ValidationError[] = [];
//         const value = req[location][fieldName];
//         for (const validator of validators) {
//           if (!validator.validator(value)) {
//             errors.push({ field: fieldName, msg: validator.message });
//             break;
//           }
//         }
//         if (req.errors) {
//           req.errors = req.errors.concat(errors);
//         } else {
//           req.errors = errors;
//         }
//         next();
//       } catch (e) {
//         next(e);
//       }
//     };
//     return middleware;
//   };

// export const body = check('body');
// export const param = check('body');

// export const custom = (validator: ValidationRule): ValidationRule => {
//   return validator;
// };

// export const isString = (message?: string): ValidationRule => {
//   return {
//     validator: (value) => typeof value === 'string',
//     message: message || 'Must be a string',
//   };
// };

// export const isEmail = (message?: string): ValidationRule => {
//   const emailRegex = /\S+@\S+\.\S+/;
//   return {
//     validator: (value) => emailRegex.test(value),
//     message: message || 'Must be a valid email',
//   };
// };

// export const isInt = (): ValidationRule => {
//   return {
//     validator: (value) => Number.isInteger(value),
//     message: 'Must be an interger',
//   };
// };

// export const isLength = (
//   options: MinMaxOptions,
//   message?: string,
// ): ValidationRule => {
//   const { min, max } = options;
//   return {
//     validator: (value) => {
//       if (min && value?.length < min) {
//         return false;
//       }
//       if (max && value?.length > max) {
//         return false;
//       }
//       return true;
//     },
//     message: message || 'Invalid value',
//   };
// };

// export const isDate = (message?: string): ValidationRule => {
//   return {
//     validator: (value) => value?.isDate(),
//     message: message || 'Invalid value',
//   };
// };
