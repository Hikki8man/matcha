import express, { NextFunction, Request, Response } from 'express';
import profileService from '../Profile/Profile.service';
import { MyRequest } from '../Types/request';
import userAccountService from '../UserAccount/UserAccount.service';
import HttpError from '../Utils/HttpError';
import asyncWrapper from '../Utils/asyncWrapper';
import CheckValidation from '../Utils/validations/checkValidationResult';
import registerValidation from '../Utils/validations/signupValidation';
import authService from './Auth.service';
import jwtRefreshStrategy from './jwtRefresh.strategy';
import { UserAccount } from '../Types/UserAccount';

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
      this.path + '/refresh',
      jwtRefreshStrategy,
      asyncWrapper(this.refresh),
    );
    this.router.post(this.path + '/logout', this.logout);
    this.router.get(this.path + '/me', this.checkToken);
  }

  register = async (req: Request, res: Response) => {
    const user = await userAccountService.create(req.body);
    console.log('user', user);
    // if (user) {
    //   await authService.sendValidationMail(user);
    // }
    res.status(201).send(user);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    console.log('body', req.body);
    const user_account = await userAccountService.validate_login(req.body);
    if (!user_account) {
      // return res.status(401).send("Email or Password incorrect");
      throw new HttpError(403, 'Email or Password incorrect');
    }
    const profile = await profileService.get_by_id(user_account.id);
    console.log('profile', user_account);
    if (!profile) {
      throw new HttpError(404, 'Profile not found');
    }
    const { access_token, refresh_token } =
      authService.generateAccessAndRefreshToken(user_account.id);
    // res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    res.send({ user_account, profile, access_token });
  };

  validateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.body;
    try {
      const user_account = await authService.validateAccount(id, token);
      if (!user_account) {
        throw new HttpError(404, 'User not found');
      }

      console.log('user validated', user_account);
      res.send(user_account);
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

  refresh = async (req: MyRequest, res: Response) => {
    const user_account = await userAccountService.get_by_id(req.user_id!);
    const profile = await profileService.get_by_id(req.user_id!);

    if (!user_account || !profile) {
      throw new HttpError(400, 'User not found');
    }

    const access_token = authService.signAccessToken(user_account.id);
    // console.log('access token refreshed: ', access_token);
    res.send({ user_account, profile, access_token });
  };

  logout = (req: Request, res: Response) => {
    console.log('logged out');
    res.clearCookie('refresh_token');
    res.end();
  };
}

export default AuthController;
