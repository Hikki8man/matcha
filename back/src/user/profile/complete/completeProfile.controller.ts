import express, { Response, NextFunction } from 'express';
import asyncWrapper from '../../../utils/middleware/asyncWrapper';
import { MyRequest } from '../../../types/request';
import editProfileService from '../edit/editProfile.service';
import profileService from '../profile.service';
import HttpError from '../../../utils/HttpError';
import { CompletedSteps } from '../../../types/profile';
import jwtStrategy from '../../../auth/jwt.strategy';

class CompleteProfileController {
  public path = '/profile/complete';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/first',
      jwtStrategy,
      asyncWrapper(this.completeFirstStep),
    );
    this.router.post(
      this.path + '/second',
      jwtStrategy,
      asyncWrapper(this.completeSecondStep),
    );
    this.router.post(
      this.path + '/third',
      jwtStrategy,
      asyncWrapper(this.completeThirdStep),
    );
  }

  completeFirstStep = async (req: MyRequest, res: Response) => {
    const profile = await profileService.get_by_id(req.user_id!);
    if (!profile) {
      throw new HttpError(404, 'User not found');
    } else if (profile.completed_steps < CompletedSteps.First) {
      throw new HttpError(400, 'Bad request');
    }
    await editProfileService.updateCompletedSteps(
      profile.id,
      CompletedSteps.Second,
    );
    res.end();
  };

  completeSecondStep = async (req: MyRequest, res: Response) => {
    const profile = await profileService.get_by_id(req.user_id!);
    if (!profile) {
      throw new HttpError(404, 'User not found');
    } else if (profile.completed_steps < CompletedSteps.Second) {
      throw new HttpError(400, 'Bad request');
    }
    await editProfileService.updateCompletedSteps(
      profile.id,
      CompletedSteps.Third,
    );
    res.end();
  };

  completeThirdStep = async (req: MyRequest, res: Response) => {
    const profile = await profileService.get_by_id(req.user_id!);
    if (!profile) {
      throw new HttpError(404, 'User not found');
    } else if (profile.completed_steps < CompletedSteps.Third) {
      throw new HttpError(400, 'Bad request');
    }
    await editProfileService.updateCompletedSteps(
      profile.id,
      CompletedSteps.Completed,
    );
    res.end();
  };
}

export default CompleteProfileController;
