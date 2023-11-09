import express, { Request, Response, NextFunction } from 'express';
import profileService from './profile.service';
import HttpError from '../../utils/HttpError';
import photoService from './photos/photo.service';
import path from 'path';
import jwtStrategy from '../../auth/jwt.strategy';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../types/request';
import { body, param } from 'express-validator';
import CheckValidation from '../../utils/validations/checkValidationResult';

class ProfileController {
  public path = '/profile';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getAll);
    this.router.get(
      this.path + '/:id',
      jwtStrategy,
      param('id').isInt(),
      CheckValidation,
      asyncWrapper(this.getById),
    );
    this.router.get(
      this.path + '/:id/avatar',
      jwtStrategy,
      param('id').isInt(),
      CheckValidation,
      asyncWrapper(this.sendAvatar),
    );
    this.router.post(
      this.path + '/like',
      jwtStrategy,
      body('id').isInt(),
      CheckValidation,
      this.like,
    );
  }

  getById = async (req: MyRequest, res: Response) => {
    console.log('param', req.params);
    const user = await profileService.get_by_id(req.params.id!);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      console.log('user found', user);
      res.send(user);
    }
  };

  getAll = async (req: MyRequest, res: Response) => {
    const user = await profileService.get_all(req.user_id!);
    res.send(user);
  };

  //TODO receive Path of avatar or stay with db call to retreive path
  sendAvatar = async (req: MyRequest, res: Response, next: NextFunction) => {
    const avatar = await photoService.getProfileAvatar(req.params.id!);
    if (!avatar) {
      throw new HttpError(404, 'Avatar not found');
    }
    res.setHeader('Content-Type', avatar.content_type);
    // res.setHeader(
    //   'Content-Disposition',
    //   `attachment; filename=${avatar.filename}`,
    // );
    const dirname = path.resolve() + '/';
    res.sendFile(dirname + avatar.path, (err) => {
      if (err && res.headersSent == false) {
        next(err);
      }
    });
  };

  like = async (req: MyRequest, res: Response) => {
    const like = await profileService.like(req.user_id!, req.body.id);
    res.send(like);
  };
}

export default ProfileController;