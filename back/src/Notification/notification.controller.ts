import express, { Response } from 'express';
import jwtStrategy from '../Auth/jwt.strategy';
import asyncWrapper from '../Utils/asyncWrapper';
import { MyRequest } from '../Types/request';
import notificationService from './notification.service';

class NotificationController {
  public path = '/notification';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, asyncWrapper(this.getAll));
  }

  getAll = async (req: MyRequest, res: Response) => {
    const notifs = await notificationService.getAll(req.user_id!);
    res.send(notifs);
  };
}

export default NotificationController;
