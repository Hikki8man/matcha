import express, { NextFunction, Request, Response } from 'express';
import profileService from '../user/profile/profile.service';
import { MyRequest } from '../types/request';
import accountService from '../user/account/account.service';
import HttpError from '../utils/HttpError';
import asyncWrapper from '../utils/middleware/asyncWrapper';
import CheckValidation from '../utils/validations/checkValidationResult';
import registerValidation from '../utils/validations/signupValidation';
import authService from './auth.service';
import jwtRefreshStrategy from './jwtRefresh.strategy';

class AuthController {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/register',
      registerValidation,
      CheckValidation,
      this.register,
    );
    this.router.post(this.path + '/login', asyncWrapper(this.login));
    this.router.post(this.path + '/validate-account', this.validateAccount);
    this.router.get(
      this.path + '/refresh-token',
      jwtRefreshStrategy,
      asyncWrapper(this.refreshToken),
    );
    this.router.get(
      this.path + '/refresh-page',
      jwtRefreshStrategy,
      asyncWrapper(this.refreshPage),
    );
    this.router.post(this.path + '/logout', this.logout);
    this.router.get(this.path + '/me', this.checkToken);
  }

  register = async (req: Request, res: Response) => {
    const user = await accountService.create(req.body);
    console.log('user', user);
    // if (user) {
    //   await authService.sendValidationMail(user);
    // }
    res.status(201).send(user);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    console.log('body', req.body);
    const account = await accountService.validate_login(req.body);
    if (!account) {
      // return res.status(401).send("Email or Password incorrect");
      throw new HttpError(403, 'Email or Password incorrect');
    }
    const profile = await profileService.get_by_id(account.id);
    console.log('profile', account);
    if (!profile) {
      throw new HttpError(404, 'Profile not found');
    }
    const { access_token, refresh_token } =
      authService.generateAccessAndRefreshToken(account.id);
    // res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    res.send({ account, profile, access_token });
  };

  validateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.body;
    try {
      const account = await authService.validateAccount(id, token);
      if (!account) {
        throw new HttpError(404, 'User not found');
      }

      console.log('user validated', account);
      res.send(account);
    } catch (err) {
      next(err);
    }
  };

  checkToken = async (req: MyRequest, res: Response, next: NextFunction) => {
    const user = await profileService.get_by_id(req.user_id!);
    if (!user) {
      return next(new HttpError(400, 'user not found'));
    }
    res.send(user);
  };

  refreshToken = async (req: MyRequest, res: Response) => {
    const profile = await profileService.get_by_id(req.user_id!);

    if (!profile) {
      throw new HttpError(400, 'User not found');
    }

    const access_token = authService.signAccessToken(profile.id);
    // console.log('access token refreshed: ', access_token);
    res.send({ access_token });
  };

  refreshPage = async (req: MyRequest, res: Response) => {
    const account = await accountService.get_by_id(req.user_id!);
    const profile = await profileService.get_by_id(req.user_id!);

    if (!account || !profile) {
      throw new HttpError(400, 'User not found');
    }

    console.log('ip: ', req.ip);

    const access_token = authService.signAccessToken(account.id);
    // console.log('access token refreshed: ', access_token);
    res.send({ account, profile, access_token });
  };

  logout = (_req: Request, res: Response) => {
    console.log('logged out');
    res.clearCookie('refresh_token');
    res.end();
  };
}

export default AuthController;
