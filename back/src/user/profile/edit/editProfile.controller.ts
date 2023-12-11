import express, { Response, NextFunction } from 'express';
import HttpError from '../../../utils/HttpError';
import photoService from '../photos/photo.service';
import jwtStrategy from '../../../auth/jwt.strategy';
import photoStorage from '../photos/photoStorage';
import asyncWrapper from '../../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../../types/request';
import CheckValidation from '../../../utils/middleware/validator/checkValidationResult';
import { Gender, SexualOrientation } from '../../../types/profile';
import tagsService from '../../../tags/tags.service';
import editProfileService from './editProfile.service';
import { tagsValidation } from '../../../utils/custom-validations/tagsValidation';
import { body } from '../../../utils/middleware/validator/check';
import { PhotoType } from '../../../types/photo';
import profileService from '../profile.service';

class EditProfileController {
  public path = '/profile/edit';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
    //todo route.use middleware ? isverified, profile completed
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/photo',
      jwtStrategy,
      body('photo_type').custom((type) =>
        Object.values(PhotoType).includes(type),
      ),
      photoStorage.single('photo'),
      asyncWrapper(this.uploadPhoto),
    );

    this.router.post(
      this.path + '/name',
      jwtStrategy,
      body('name').isString(),
      CheckValidation,
      asyncWrapper(this.name),
    );

    this.router.post(
      this.path + '/tags',
      jwtStrategy,
      tagsValidation('tags'),
      CheckValidation,
      this.tags,
    );

    this.router.post(
      this.path + '/bio',
      jwtStrategy,
      body('bio').isString(),
      CheckValidation,
      asyncWrapper(this.bio),
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
    this.router.post(
      this.path + '/location',
      jwtStrategy,
      body('latitude').isNumeric(),
      body('longitude').isNumeric(),
      body('city').isString(),
      body('country').isString(),
      CheckValidation,
      asyncWrapper(this.location),
    );
  }

  uploadPhoto = async (req: MyRequest, res: Response, next: NextFunction) => {
    await photoService.uploadPhoto(req.user_id!, req.body.photo_type, req.file);
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
    res.end();
  };

  tags = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await tagsService.editTags(req.user_id!, req.body.tags);
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    res.end();
  };

  location = async (req: MyRequest, res: Response) => {
    console.log('edit body: ', req.body);
    const updated = await editProfileService.editLocation(
      req.user_id!,
      req.body,
    );
    if (!updated) {
      throw new HttpError(400, 'Bad request');
    }
    res.end();
  };
}

export default EditProfileController;
