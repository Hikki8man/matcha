import express, { Response } from 'express';
import jwtStrategy from '../auth/jwt.strategy';
import asyncWrapper from '../utils/middleware/asyncWrapper';
import { MyRequest } from '../types/request';
import notificationService from './notification.service';

class NotificationController {
  public path = '/notification';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, asyncWrapper(this.getAll));
    this.router.get(
      this.path + '/read',
      jwtStrategy,
      asyncWrapper(this.readNotifications),
    );
  }

  getAll = async (req: MyRequest, res: Response) => {
    const notifs = await notificationService.getAll(req.user_id!);
    res.send(notifs);
  };

  readNotifications = async (req: MyRequest, res: Response) => {
    await notificationService.readNotifications(req.user_id!);
    res.end();
  };
}

export default NotificationController;
