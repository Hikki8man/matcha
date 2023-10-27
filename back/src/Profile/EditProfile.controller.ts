import express, { Request, Response, NextFunction } from 'express';
import profileService from './Profile.service';
import HttpError from '../Utils/HttpError';
import photoService from './Photo.service';
import { validateMIMEType } from 'validate-image-type';
import fs from 'fs/promises';
import path from 'path';
import jwtStrategy from '../Auth/jwt.strategy';
import photoStorage from '../Utils/photoStorage';
import asyncWrapper from '../Utils/asyncWrapper';
import { MyRequest } from '../Types/request';
import { body, check, param } from 'express-validator';
import CheckValidation from '../Utils/validations/checkValidationResult';
import { CompletedSteps, Gender } from '../Types/Profile';

class EditProfileController {
  public path = '/profile/edit';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/upload',
      jwtStrategy,
      photoStorage.single('photo'),
      asyncWrapper(this.upload),
    );

    this.router.post(
      this.path + '/name',
      jwtStrategy,
      body('name').isString(),
      CheckValidation,
      asyncWrapper(this.name),
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

  upload = async (req: MyRequest, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log('file', file);

    if (!file) {
      throw new HttpError(400, 'Please upload a file');
    }
    const result = await validateMIMEType(file.path, {
      originalFilename: file.originalname,
      allowMimeTypes: ['image/jpeg', 'image/png'],
    });
    if (!result.ok) {
      await fs.unlink(file.path);
      throw new HttpError(400, 'Invalid file type');
    }
    await photoService.insert(req.user_id!, file);
    console.log('result: ', result);
    res.send(file);
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
}

export default EditProfileController;
