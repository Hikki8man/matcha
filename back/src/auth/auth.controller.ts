import express, { NextFunction, Request, Response } from 'express';
import profileService from '../user/profile/profile.service';
import { MyRequest } from '../types/request';
import accountService from '../user/account/account.service';
import HttpError from '../utils/HttpError';
import asyncWrapper from '../utils/middleware/asyncWrapper';
import CheckValidation from '../utils/middleware/validator/checkValidationResult';
import registerValidation from '../utils/custom-validations/signupValidation';
import authService from './auth.service';
import jwtRefreshStrategy from './jwtRefresh.strategy';
import { body } from '../utils/middleware/validator/check';
import editAccountService from '../user/account/edit-account.service';

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
    this.router.post(
      this.path + '/login',
      body('username').isString(),
      body('password').isString(),
      CheckValidation,
      asyncWrapper(this.login),
    );
    this.router.post(
      this.path + '/verify-account',
      body('token').isString(),
      CheckValidation,
      asyncWrapper(this.verifyAccount),
    );
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
    this.router.post(
      this.path + '/forgot-password',
      body('email').isEmail().withMessage('Adresse email invalide'),
      CheckValidation,
      asyncWrapper(this.forgotPassword),
    );
    this.router.post(
      this.path + '/reset-password',
      body('password').isString(),
      CheckValidation,
      asyncWrapper(this.resetPassword),
    );
    this.router.post(this.path + '/logout', this.logout);
    this.router.get(this.path + '/me', this.checkToken); //TODO is it used?
  }

  register = async (req: Request, res: Response) => {
    const user = await accountService.create(req.body);
    if (user) {
      await authService.sendValidationMail(user);
    }
    res.status(201).end();
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    console.log('body', req.body);
    const account = await accountService.validate_login(
      req.body.username,
      req.body.password,
    );
    if (!account) {
      throw new HttpError(403, "Nom d'utilisateur ou mot de passe incorrect");
    }
    const profile = await profileService.get_by_id(account.id);
    console.log('profile', account);
    if (!profile) {
      throw new HttpError(404, 'Profil introuvable');
    }
    const { access_token, refresh_token } =
      authService.generateAccessAndRefreshToken(account.id);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      // sameSite: 'none',
      // secure: true,
    });
    //TODO remove acc
    res.send({ account, profile, access_token });
  };

  verifyAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    const account = await authService.verifyAccount(token);
    if (!account) {
      throw new HttpError(404, "Ce compte n'existe pas");
    }
    console.log('user validated', account);
    res.end();
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
    res.send({ account, profile, access_token });
  };

  forgotPassword = async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    res.end();
  };

  resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const payload = authService.verifyToken(token);
    if (!payload) {
      throw new HttpError(400, 'Invalid token');
    }
    const account = await accountService.get_by_id(payload.id);
    if (!account) {
      throw new HttpError(404, 'User not found');
    }
    await editAccountService.updatePassword(account.id, password);
    res.end();
  };

  logout = (_req: Request, res: Response) => {
    console.log('logged out');
    res.clearCookie('refresh_token');
    res.end();
  };
}

export default AuthController;
