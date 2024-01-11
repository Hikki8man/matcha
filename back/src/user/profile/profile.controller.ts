import express, { Response } from 'express';
import profileService from './profile.service';
import jwtStrategy from '../../auth/jwt.strategy';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../types/request';
import CheckValidation from '../../utils/middleware/validator/checkValidationResult';
import { body, param } from '../../utils/middleware/validator/check';
import { OrderBy } from '../../types/filter';
import { tagsValidation } from '../../utils/custom-validations/tagsValidation';
import SocketService from '../../socket.service';
import { profileCompleteGuard } from '../../utils/middleware/profileComplete.guard';
import likeService from './like/like.service';
import viewService from './view/view.service';
import aboutService from '../about/about.service';

class ProfileController {
  public path = '/profile';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/filter',
      jwtStrategy,
      profileCompleteGuard,
      body('max_dist').isInt(),
      body('min_age').isInt(),
      body('max_age').isInt(),
      body('min_fame').isInt(),
      body('max_fame').isInt(),
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
    this.router.post(
      this.path + '/report',
      jwtStrategy,
      profileCompleteGuard,
      body('id').isInt(),
      body('reason').isString(),
      CheckValidation,
      asyncWrapper(this.report),
    );
  }

  getProfileCardAndIsLikedById = async (req: MyRequest, res: Response) => {
    const id = +req.params.id!;
    const profile = await profileService.profileCardById(id);
    if (!profile) {
      res.status(404).send('User not found');
    } else {
      const liked = await likeService.isLiked(req.user_id!, id);
      const likedYou = await likeService.isLiked(id, req.user_id!);
      if (id !== req.user_id!) {
        await viewService.addProfileView(req.user_id!, id);
      }
      const about = await aboutService.getById(profile.id);
      res.send({ profile, liked, likedYou, about });
    }
  };

  getAllFiltered = async (req: MyRequest, res: Response) => {
    const result = await profileService.get_all_filtered(
      req.user_id!,
      req.body,
    );
    res.send(result);
  };

  like = async (req: MyRequest, res: Response) => {
    const likeEvent = await likeService.like(req.user_id!, req.body.id);
    if (likeEvent) {
      SocketService.sendLikeEvent(req.body.id, likeEvent);
    }
    await profileService.updateFameRating(req.user_id!);
    await profileService.updateFameRating(req.body.id);
    res.end();
  };

  liker_list = async (req: MyRequest, res: Response) => {
    const liker_list = await likeService.getLikerList(req.user_id!);
    res.send(liker_list);
  };

  profile_view_list = async (req: MyRequest, res: Response) => {
    const profile_views = await viewService.getProfileViews(req.user_id!);
    res.send(profile_views);
  };

  report = async (req: MyRequest, res: Response) => {
    const { id, reason } = req.body;
    await profileService.report(req.user_id!, id, reason);
    res.end();
  };
}

export default ProfileController;
