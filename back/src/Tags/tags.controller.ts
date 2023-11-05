import express, { Request, Response, NextFunction } from 'express';
import jwtStrategy from '../Auth/jwt.strategy';
import { MyRequest } from '../Types/request';
import tagsService from './tags.service';
import { body } from 'express-validator';
import CheckValidation from '../Utils/validations/checkValidationResult';

class TagsController {
  public path = '/tags';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getAll);
  }

  getAll = async (req: MyRequest, res: Response) => {
    const tags = await tagsService.getAll();
    res.send(tags);
  };
}

export default TagsController;
