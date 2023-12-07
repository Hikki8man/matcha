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
import SocketService from '../../socket.service';
import { profileCompleteGuard } from '../../utils/middleware/profileComplete.guard';

class ProfileController {
  public path = '/profile';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getAll); // TODO del
    this.router.post(
      this.path + '/filter',
      jwtStrategy,
      profileCompleteGuard,
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
      this.path + '/views',
      jwtStrategy,
      profileCompleteGuard,
      this.profile_view_list,
    );
    this.router.get(
      this.path + '/:id',
      jwtStrategy,
      profileCompleteGuard,
      param('id').isNumeric(),
      CheckValidation,
      asyncWrapper(this.getProfileCardAndIsLikedById),
    );
    this.router.get(
      this.path + '/:id/avatar',
      jwtStrategy,
      profileCompleteGuard,
      param('id').isNumeric(),
      CheckValidation,
      asyncWrapper(this.sendAvatar),
    );
    this.router.post(
      this.path + '/like',
      jwtStrategy,
      profileCompleteGuard,
      body('id').isInt(),
      CheckValidation,
      this.like,
    );
    this.router.get(
      this.path + '/like/likers',
      jwtStrategy,
      profileCompleteGuard,
      this.liker_list,
    );
  }

  // getById = async (req: MyRequest, res: Response) => {
  //   console.log('param', req.params);
  //   const user = await profileService.get_by_id(req.params.id!);
  //   if (!user) {
  //     res.status(404).send('User not found');
  //   } else {
  //     res.send(user);
  //   }
  // };

  // TODO separate route for myProfile and Other profiles?
  getProfileCardAndIsLikedById = async (req: MyRequest, res: Response) => {
    const id = +req.params.id!;
    const profile = await profileService.profileCardById(id);
    if (!profile) {
      res.status(404).send('User not found');
    } else {
      const isLiked = await profileService.isLiked(req.user_id!, id);
      if (id !== req.user_id!) {
        await profileService.addProfileView(req.user_id!, id);
      }
      res.send({ profile, isLiked });
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

  sendAvatar = async (req: MyRequest, res: Response, next: NextFunction) => {
    const avatar = await photoService.getProfileAvatar(req.params.id!);
    if (!avatar) {
      throw new HttpError(404, 'Avatar not found');
    }
    // res.setHeader('Content-Type', avatar.content_type);
    const dirname = path.resolve() + '/';
    res.sendFile(dirname + avatar.path, (err) => {
      if (err && res.headersSent == false) {
        next(err);
      }
    });
  };

  sendPhotos = async (req: MyRequest, res: Response, next: NextFunction) => {
    const photos = await photoService.getProfilePhotos(req.params.id!);
    if (!photos) {
      throw new HttpError(404, 'Photos not found');
    }
    // res.setHeader('Content-Type', photos.content_type);
    // const dirname = path.resolve() + '/';
    // res.sendFile(dirname + photos.path, (err) => {
    //   if (err && res.headersSent == false) {
    //     next(err);
    //   }
    // });
  };

  like = async (req: MyRequest, res: Response) => {
    const likeEvent = await profileService.like(req.user_id!, req.body.id);
    console.log('like Event', likeEvent);
    if (likeEvent) {
      SocketService.sendLikeEvent(req.body.id, likeEvent);
    }
    res.end();
  };

  liker_list = async (req: MyRequest, res: Response) => {
    const liker_list = await profileService.getLikerList(req.user_id!);
    res.send(liker_list);
  };

  profile_view_list = async (req: MyRequest, res: Response) => {
    const profile_views = await profileService.getProfileViews(req.user_id!);
    res.send(profile_views);
  };
}

export default ProfileController;
