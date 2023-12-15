import express, { Response } from 'express';
import jwtStrategy from '../../auth/jwt.strategy';
import { MyRequest } from '../../types/request';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { body } from '../../utils/middleware/validator/check';
import aboutService from './about.service';

export class AboutController {
  public path = '/about';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/from',
      jwtStrategy,
      body('from').isString(),
      asyncWrapper(this.editFrom),
    );

    this.router.post(
      this.path + '/job',
      jwtStrategy,
      body('job').isString(),
      asyncWrapper(this.editJob),
    );

    this.router.post(
      this.path + '/studies',
      jwtStrategy,
      body('studies').isString(),
      asyncWrapper(this.editStudies),
    );

    this.router.post(
      this.path + '/languages',
      jwtStrategy,
      body('languages').isString(),
      asyncWrapper(this.editLanguages),
    );

    this.router.post(
      this.path + '/smoking',
      jwtStrategy,
      body('smoking').isString(),
      asyncWrapper(this.editSmoking),
    );

    this.router.post(
      this.path + '/drinking',
      jwtStrategy,
      body('drinking').isString(),
      asyncWrapper(this.editDrinking),
    );

    this.router.post(
      this.path + '/drugs',
      jwtStrategy,
      body('drugs').isString(),
      asyncWrapper(this.editDrugs),
    );
  }

  editFrom = async (req: MyRequest, res: Response) => {
    await aboutService.editFrom(req.user_id!, req.body.from);
    res.end();
  };

  editJob = async (req: MyRequest, res: Response) => {
    await aboutService.editJob(req.user_id!, req.body.job);
    res.end();
  };

  editStudies = async (req: MyRequest, res: Response) => {
    await aboutService.editStudies(req.user_id!, req.body.studies);
    res.end();
  };

  editLanguages = async (req: MyRequest, res: Response) => {
    await aboutService.editLanguages(req.user_id!, req.body.languages);
    res.end();
  };

  editSmoking = async (req: MyRequest, res: Response) => {
    await aboutService.editSmoking(req.user_id!, req.body.smoking);
    res.end();
  };

  editDrinking = async (req: MyRequest, res: Response) => {
    await aboutService.editDrinking(req.user_id!, req.body.drinking);
    res.end();
  };

  editDrugs = async (req: MyRequest, res: Response) => {
    await aboutService.editDrugs(req.user_id!, req.body.drugs);
    res.end();
  };
}
