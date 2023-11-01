import express, { Request, Response, NextFunction } from 'express';
import userAccountService from './UserAccount.service';
import jwtStrategy from '../Auth/jwt.strategy';
import { MyRequest } from '../Types/request';

class UserAccountController {
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
    const user = await userAccountService.get_by_id(req.user_id!);
    console.log('user', user);
    res.send(user);
  };
}

export default UserAccountController;
