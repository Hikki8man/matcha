import express, { Response } from 'express';
import jwtStrategy from '../../auth/jwt.strategy';
import SocketService from '../../socket.service';
import { MyRequest } from '../../types/request';
import {
  emailNotTaken,
  usernameNotTaken,
} from '../../utils/custom-validations/signupValidation';
import asyncWrapper from '../../utils/middleware/asyncWrapper';
import { body } from '../../utils/middleware/validator/check';
import CheckValidation from '../../utils/middleware/validator/checkValidationResult';
import accountService from './account.service';
import editAccountService from './edit-account.service';

class AccountController {
  public path = '/account';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, jwtStrategy, this.getUserById);
    this.router.post(
      this.path + '/edit/firstname',
      jwtStrategy,
      body('firstname').isString(),
      CheckValidation,
      asyncWrapper(this.editFirstname),
    );

    this.router.post(
      this.path + '/edit/lastname',
      jwtStrategy,
      body('lastname').isString(),
      CheckValidation,
      asyncWrapper(this.editLastname),
    );

    this.router.post(
      this.path + '/edit/username',
      jwtStrategy,
      body('username')
        .isString()
        .isLength({ min: 1, max: 25 })
        .withMessage("Le nom d'utilisateur ne peut pas être vide")
        .custom(usernameNotTaken)
        .withMessage("Ce nom d'utilisateur est déjà utilisé"),
      CheckValidation,
      asyncWrapper(this.editUsername),
    );

    this.router.post(
      this.path + '/edit/email',
      jwtStrategy,
      body('email')
        .isEmail()
        .withMessage('Adresse email invalide')
        .custom(emailNotTaken)
        .withMessage('Cet email est déjà utilisé'),
      CheckValidation,
      asyncWrapper(this.editEmail),
    );

    this.router.post(
      this.path + '/edit/password',
      jwtStrategy,
      body('old_password').isString(),
      body('new_password')
        .isString()
        .isStrongPassword()
        .withMessage(
          'Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule et un caractère spécial.',
        ),
      CheckValidation,
      asyncWrapper(this.editPassword),
    );
  }

  getUserById = async (req: MyRequest, res: Response) => {
    const user = await accountService.get_by_id(req.user_id!);
    res.send(user);
  };

  editFirstname = async (req: MyRequest, res: Response) => {
    await editAccountService.editFirstname(req.user_id!, req.body.firstname);
    res.end();
  };

  editLastname = async (req: MyRequest, res: Response) => {
    await editAccountService.editLastname(req.user_id!, req.body.lastname);
    res.end();
  };

  editEmail = async (req: MyRequest, res: Response) => {
    await editAccountService.editEmail(req.user_id!, req.body.email);
    SocketService.sendLogout(req.user_id!);
    res.end();
  };

  editUsername = async (req: MyRequest, res: Response) => {
    await editAccountService.editUsername(req.user_id!, req.body.username);
    res.end();
  };

  editPassword = async (req: MyRequest, res: Response) => {
    await editAccountService.editPassword(
      req.user_id!,
      req.body.old_password,
      req.body.new_password,
    );
    res.end();
  };
}

export default AccountController;
