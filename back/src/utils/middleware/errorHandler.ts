import { Request, Response, NextFunction } from 'express';
import HttpError from '../HttpError';

function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Handle the error here
  console.error('error handle:', err);
  res.status(err.status || 500).send(err.message);
}

export default errorHandler;
