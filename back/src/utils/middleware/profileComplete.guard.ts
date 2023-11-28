import { NextFunction, Response } from 'express';
import { MyRequest } from '../../types/request';
import profileService from '../../user/profile/profile.service';

export async function profileCompleteGuard(
  req: MyRequest,
  res: Response,
  next: NextFunction,
) {
  const isComplete = await profileService.isProfileComplete(req.user_id!);
  isComplete ? next() : res.status(404).send('Profile not completed');
}
