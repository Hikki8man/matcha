import { Result, ValidationError, validationResult } from 'express-validator';
import { MyRequest } from '../../types/request';
import { NextFunction, Response } from 'express';

// const hasFailedValidation = (
//   req: MyRequest,
//   res: Response
// ): Result<ValidationError> | boolean => {
function CheckValidation(req: any, res: Response, next: NextFunction) {
  // const errors = validationResult(req);
  // if (errors.isEmpty()) {
  //   next();
  // } else {
  //   console.log('errors: ', errors);
  //   res.status(400).send(errors);
  // }

  const errors = req.errors as ValidationError[];
  if (!errors || (errors && errors.length === 0)) {
    next();
  } else {
    console.log('errors: ', errors);
    res.status(400).send(errors);
  }
}

export default CheckValidation;
