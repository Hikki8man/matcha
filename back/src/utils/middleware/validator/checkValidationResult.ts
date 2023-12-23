import { NextFunction, Response } from 'express';

function CheckValidation(req: any, res: Response, next: NextFunction) {
  const errors = req.errors;
  if (errors && errors.length > 0) {
    res.status(400).send(errors);
  } else {
    next();
  }
}

export default CheckValidation;
