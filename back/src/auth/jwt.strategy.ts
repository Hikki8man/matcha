import { Response, NextFunction } from 'express';
import { MyRequest } from '../types/request';
import authService from './auth.service';

function jwtStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const access_token = authService.extractAccessToken(
    req.headers.authorization,
  );
  if (access_token) {
    const payload = authService.verifyToken(access_token);
    if (payload) {
      req.user_id = payload.id;
      next();
    } else {
      res.status(401).send('Access token expired');
    }
  } else {
    res.status(401).send('Access token expired');
  }
}

export default jwtStrategy;
