import express, { NextFunction, Request, Response } from 'express';
// import { body, isString } from '../utils/middleware/validator';
import CheckValidation from '../utils/middleware/validator/checkValidationResult';
import { body as bodyExpress } from 'express-validator';
import { body } from '../utils/middleware/validator/check';

class TestController {
  public path = '/test';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      body('test').isString().withMessage('test pas bon'),
      body('test').isString().withMessage('test pas du tou'),
      CheckValidation,
      this.test,
    );

    this.router.post(
      this.path + '/1',
      bodyExpress('test').isString().withMessage('testtest'),
      // CheckValidation,
      this.test1,
    );
  }

  test = (req: any, res: Response) => {
    // console.log('test', req.errors);
    console.log('test');
    res.end();
  };

  test1 = (req: any, res: Response) => {
    // console.log('test', req.errors);
    console.log('test');
    res.end();
  };
}

export default TestController;
