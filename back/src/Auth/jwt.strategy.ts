import { Response, NextFunction } from 'express';
import { MyRequest } from '../Types/request';
import authService from './Auth.service';

function jwtStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const access_token: string = req.cookies.access_token;
  const payload = authService.verifyToken(access_token);
  if (payload) {
    req.user_id = payload.id;
    next();
  } else {
    console.log('access token expired');
    res.clearCookie('access_token');
    res.status(401).send('Access token expired');
  }
}

export default jwtStrategy;
