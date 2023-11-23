import { Response, NextFunction } from 'express';
import { MyRequest } from '../types/request';
import authService from './auth.service';

function jwtRefreshStrategy(req: MyRequest, res: Response, next: NextFunction) {
  //TODO revoke refresh token with a boolean in account, when logout revoke to true ?
  const refresh_token: string = req.cookies.refresh_token;
  const payload = authService.verifyToken(refresh_token);
  if (payload) {
    req.user_id = payload.id;
    next();
  } else {
    res.clearCookie('refresh_token');
    res.status(401).send('Refresh token expired');
  }
}

export default jwtRefreshStrategy;
