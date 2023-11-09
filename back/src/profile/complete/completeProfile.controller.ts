import express, { Response, NextFunction } from 'express';
import profileService from '../profile.service';
import HttpError from '../../utils/HttpError';
import photoService from '../photos/photo.service';
import jwtStrategy from '../../auth/jwt.strategy';
import photoStorage from '../../user/profile/photos/photoStorage';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../types/request';
import { body, check, param } from 'express-validator';
import CheckValidation from '../../utils/validations/checkValidationResult';
import { CompletedSteps, Gender } from '../../types/profile';
import tagsService from '../../tags/tags.service';

class CompleteProfileController {
  public path = '/profile/complete';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
    //todo route.use middleware ? isverified, profile completed
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/avatar',
      jwtStrategy,
      photoStorage.single('photo'),
      asyncWrapper(this.uploadAvatar),
    );

    this.router.post(
      this.path + '/name',
      jwtStrategy,
      body('name').isString(),
      CheckValidation,
      asyncWrapper(this.name),
    );

    this.router.post(
      this.path + '/bio',
      jwtStrategy,
      body('bio').isString(),
      CheckValidation,
      asyncWrapper(this.bio),
    );

    this.router.post(
      this.path + '/tags',
      jwtStrategy,
      [body('tags').exists(), body('tags.*.id').isInt()],
      CheckValidation,
      this.tags,
    );

    this.router.post(
      this.path + '/gender',
      jwtStrategy,
      body('gender').custom((gender) => {
        return Object.values(Gender).includes(gender);
      }),
      CheckValidation,
      asyncWrapper(this.gender),
    );
  }

  uploadAvatar = async (req: MyRequest, res: Response, next: NextFunction) => {
    await photoService.uploadAvatar(req.user_id!, req.file);
    profileService.updateCompteteSteps(req.user_id!, CompletedSteps.Tags);
    res.end();
  };

  name = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await profileService.editName(req.user_id!, req.body.name);
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    profileService.updateCompteteSteps(req.user_id!, CompletedSteps.Gender);
    res.end();
  };

  gender = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await profileService.editGender(
      req.user_id!,
      req.body.gender,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    profileService.updateCompteteSteps(req.user_id!, CompletedSteps.Photo);
    res.end();
  };

  bio = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await profileService.editBio(req.user_id!, req.body.bio);
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    profileService.updateCompteteSteps(req.user_id!, CompletedSteps.Completed);
    res.end();
  };

  tags = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await tagsService.editTags(req.user_id!, req.body.tags);
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    profileService.updateCompteteSteps(req.user_id!, CompletedSteps.Bio);
    res.end();
  };
}

export default CompleteProfileController;
