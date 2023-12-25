import express, { Response } from 'express';
import jwtStrategy from '../../../auth/jwt.strategy';
import { MyRequest } from '../../../types/request';
import asyncWrapper from '../../../utils/middleware/asyncWrapper';
import { param } from '../../../utils/middleware/validator/check';
import CheckValidation from '../../../utils/middleware/validator/checkValidationResult';
import blockService from './block.service';

class BlockController {
  public path = '/profile/block';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path + '/:id',
      jwtStrategy,
      param('id').isNumeric(),
      CheckValidation,
      asyncWrapper(this.block),
    );
    this.router.get(
      '/profile/unblock/:id',
      jwtStrategy,
      param('id').isNumeric(),
      CheckValidation,
      asyncWrapper(this.unblock),
    );
  }

  block = async (req: MyRequest, res: Response) => {
    await blockService.block(req.user_id!, +req.params.id!);
    res.end();
  };

  unblock = async (req: MyRequest, res: Response) => {
    await blockService.unblock(req.user_id!, +req.params.id!);
    res.end();
  };
}

export default BlockController;
