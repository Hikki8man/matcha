import express, { Request, Response, NextFunction } from 'express';
import profileService from './profile.service';
import HttpError from '../../utils/HttpError';
import photoService from './photos/photo.service';
import path from 'path';
import jwtStrategy from '../../auth/jwt.strategy';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../types/request';
import CheckValidation from '../../utils/middleware/validator/checkValidationResult';
import { body, param } from '../../utils/middleware/validator/check';
import { Filter, OrderBy } from '../../types/filter';
import { tagsValidation } from '../../utils/custom-validations/tagsValidation';

class ProfileController {
  public path = '/profile';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getAll);
    this.router.post(
      this.path + '/filter',
      jwtStrategy,
      body('max_dist').isInt(),
      body('min_age').isInt(),
      body('max_age').isInt(),
      body('offset').isInt(),
      body('order_by').custom((order) =>
        Object.values(OrderBy).includes(order),
      ),
      tagsValidation('common_tags'),
      CheckValidation,
      this.getAllFiltered,
    );
    this.router.get(
      this.path + '/:id',
      jwtStrategy,
      param('id').isNumeric(),
      CheckValidation,
      asyncWrapper(this.getById),
    );
    this.router.get(
      this.path + '/:id/avatar',
      jwtStrategy,
      param('id').isNumeric(),
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
    this.router.get(this.path + '/like/likers', jwtStrategy, this.liker_list);
  }

  getById = async (req: MyRequest, res: Response) => {
    console.log('param', req.params);
    const user = await profileService.get_by_id(req.params.id!);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      // console.log('user found', user);
      res.send(user);
    }
  };

  getAll = async (req: MyRequest, res: Response) => {
    const user = await profileService.get_all(req.user_id!);
    res.send(user);
  };

  getAllFiltered = async (req: MyRequest, res: Response) => {
    console.log('body', req.body);
    const user = await profileService.get_all_filtered(req.user_id!, req.body);
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
    // );alo
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

  liker_list = async (req: MyRequest, res: Response) => {
    const liker_list = await profileService.getLikerList(req.user_id!);
    console.log('Getting liker list');
    res.send(liker_list);
  };
}

export default ProfileController;
