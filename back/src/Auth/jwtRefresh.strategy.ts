import { Response, NextFunction } from 'express';
import { MyRequest } from '../Types/request';
import authService from './Auth.service';

function jwtRefreshStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const refresh_token: string = req.cookies.refresh_token;
  const payload = authService.verifyToken(refresh_token);
  if (payload) {
    req.user_id = payload.id;
    next();
  } else {
    console.log('refresh token expired');
    res.clearCookie('refresh_token');
    res.status(401).send('Refresh token expired');
  }
}

export default jwtRefreshStrategy;
