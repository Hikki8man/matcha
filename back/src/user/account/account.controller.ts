import express, { Request, Response, NextFunction } from 'express';
import accountService from './account.service';
import jwtStrategy from '../../auth/jwt.strategy';
import { MyRequest } from '../../types/request';

class AccountController {
  public path = '/user';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + '/:id', jwtStrategy, this.getUserById);
  }

  getUserById = async (req: MyRequest, res: Response) => {
    console.log('getting user');
    const user = await accountService.get_by_id(req.user_id!);
    console.log('user', user);
    res.send(user);
  };
}

export default AccountController;