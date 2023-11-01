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
    this.router.post(
      this.path + '/add',
      jwtStrategy,
      [body('tags').exists(), body('tags.*.id').isInt()],
      CheckValidation,
      this.add,
    );
    this.router.post(
      this.path + '/remove',
      jwtStrategy,
      [body('tags').exists(), body('tags.*.id').isInt()],
      CheckValidation,
      this.remove,
    );
  }

  getAll = async (req: MyRequest, res: Response) => {
    const tags = await tagsService.getAll();
    res.send(tags);
  };

  //todo one function with tags_to_add and tags_to_remove?

  add = (req: MyRequest, res: Response) => {
    console.log('hi');
    tagsService.add(req.user_id!, req.body.tags);
    res.end();
  };

  remove = (req: MyRequest, res: Response) => {
    tagsService.remove(req.user_id!, req.body.tags);
    res.end();
  };
}

export default TagsController;
