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
    this.router.get(this.path + '/refresh', jwtRefreshStrategy, this.refresh);
    this.router.post(this.path + '/logout', this.logout);
    this.router.get(this.path + '/me', this.checkToken)
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
      throw new HttpError(401, 'Email or Password incorrect');
    }
    const profile = await profileService.get_by_id(user_account.id);
    if (!profile) {
      throw new HttpError(404, 'Profile not found');
    }
    const { access_token, refresh_token } =
      authService.generateAccessAndRefreshToken(user_account);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    res.send({ user_account, profile });
  };

  validateAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { id, token } = req.body;
    try {
      const user_account = await authService.validateAccount(id, token);
      if (!user_account) {
        throw new HttpError(404, 'User not found');
      }

      console.log('user validated', user_account);
      const signed_token = authService.signToken(
        { id: user_account.id },
        { expiresIn: '30m' },
      );
      console.log('signed token', signed_token);
      res.cookie('token', signed_token, {
        httpOnly: true,
      });
      res.send(user_account);
    } catch (err) {
      next(err);
    }
  };

  checkToken = async (req: MyRequest, res: Response, next: NextFunction) => {
    const user = await profileService.get_by_id(req.user_id!);
    if (!user) {
      return next(new HttpError(400, "user not found"));
    }
    res.send(user);
  };

  refresh = async (req: MyRequest, res: Response) => {
    // console.log("token refreshed");
    const user_acc = await userAccountService.get_by_id(req.user_id!);
    const profile = await profileService.get_by_id(req.user_id!);

    if (!user_acc || !profile) {
      throw new HttpError(400, 'User not found');
    }

    const access_token = authService.signToken(
      { id: user_acc?.id },
      { expiresIn: '15m' },
    );
    res.cookie('access_token', access_token);
    res.send({ user_acc, profile });
  };

  logout = async (req: Request, res: Response) => {
    console.log('loging out');
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.end();
  };
}

export default AuthController;
