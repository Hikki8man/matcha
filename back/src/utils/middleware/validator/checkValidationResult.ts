import { Result, ValidationError, validationResult } from 'express-validator';
import { MyRequest } from '../../../types/request';
import { NextFunction, Response } from 'express';

function CheckValidation(req: any, res: Response, next: NextFunction) {
  // const errors = validationResult(req);
  // if (errors.isEmpty()) {
  //   next();
  // } else {
  //   console.log('errors: ', errors);
  //   res.status(400).send(errors);
  // }

  // const errors = req.errors as ValidationError[];
  // if (!errors || (errors && errors.length === 0)) {
  //   next();
  // } else {
  //   console.log('errors: ', errors);
  //   res.status(400).send(errors);
  // }

  const errors = validationResult(req);
  const errors2 = req.errors as ValidationError[];
  if (!errors.isEmpty()) {
    res.status(400).send(errors);
  } else if (errors2 && errors2.length > 0) {
    res.status(400).send(errors2);
  } else {
    next();
  }
}

export default CheckValidation;
