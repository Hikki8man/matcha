import express, { Response, NextFunction } from 'express';
import profileService from '../profile.service';
import HttpError from '../../../utils/HttpError';
import photoService from '../photos/photo.service';
import jwtStrategy from '../../../auth/jwt.strategy';
import photoStorage from '../photos/photoStorage';
import asyncWrapper from '../../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../../types/request';
import CheckValidation from '../../../utils/middleware/validator/checkValidationResult';
import {
  CompletedSteps,
  Gender,
  SexualOrientation,
} from '../../../types/profile';
import tagsService from '../../../tags/tags.service';
import editProfileService from '../edit/editProfile.service';
import { tagsValidation } from '../../../utils/custom-validations/tagsValidation';
import { body } from '../../../utils/middleware/validator/check';

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
      tagsValidation('tags'),
      CheckValidation,
      this.tags,
    );

    this.router.post(
      this.path + '/gender',
      jwtStrategy,
      body('gender').custom((gender) => Object.values(Gender).includes(gender)),
      CheckValidation,
      asyncWrapper(this.gender),
    );

    this.router.post(
      this.path + '/sexual-orientation',
      jwtStrategy,
      body('orientation').custom((orientation) =>
        Object.values(SexualOrientation).includes(orientation),
      ),
      CheckValidation,
      asyncWrapper(this.sexualOrientation),
    );
  }

  uploadAvatar = async (req: MyRequest, res: Response, next: NextFunction) => {
    await photoService.uploadAvatar(req.user_id!, req.file);
    editProfileService.updateCompteteSteps(req.user_id!, CompletedSteps.Tags);
    res.end();
  };

  name = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await editProfileService.editName(
      req.user_id!,
      req.body.name,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    editProfileService.updateCompteteSteps(req.user_id!, CompletedSteps.Gender);
    res.end();
  };

  gender = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await editProfileService.editGender(
      req.user_id!,
      req.body.gender,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    editProfileService.updateCompteteSteps(
      req.user_id!,
      CompletedSteps.SexualOrientation,
    );
    res.end();
  };

  sexualOrientation = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await editProfileService.editSexualOrientation(
      req.user_id!,
      req.body.orientation,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    editProfileService.updateCompteteSteps(req.user_id!, CompletedSteps.Photo);
    res.end();
  };

  bio = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await editProfileService.editBio(
      req.user_id!,
      req.body.bio,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    editProfileService.updateCompteteSteps(
      req.user_id!,
      CompletedSteps.Completed,
    );
    res.end();
  };

  tags = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await tagsService.editTags(req.user_id!, req.body.tags);
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    editProfileService.updateCompteteSteps(req.user_id!, CompletedSteps.Bio);
    res.end();
  };
}

export default CompleteProfileController;
