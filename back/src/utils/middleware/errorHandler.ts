import { Request, Response, NextFunction } from 'express';
import HttpError from '../HttpError';

function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(err.status || 500).send(err.message);
}

export default errorHandler;
