import moment from 'moment';
import userService from '../../user/account/account.service';
import { body } from '../middleware/validator/check';

export const emailNotTaken = async (email: string) => {
  const userfound = await userService.get_by_email(email);
  return userfound ? false : true;
};

export const usernameNotTaken = async (username: string) => {
  const userfound = await userService.get_by_username(username);
  return userfound ? false : true;
};

const isOverEighteen = (birth_date: Date) => {
  const today = moment();
  const birthDate = moment(birth_date, 'YYYY-MM-DD');
  const age = today.diff(birthDate, 'years');
  if (age < 18) {
    return false;
  }
  return true;
};

const registerValidation = [
  body('username')
    .isString()
    .isLength({ min: 1 })
    .withMessage("Le nom d'utilisateur ne peut pas être vide")
    .custom(usernameNotTaken)
    .withMessage("Ce nom d'utilisateur est déjà utilisé"),
  body('firstname').isString(),
  body('lastname').isString(),
  body('email')
    .isEmail()
    .withMessage('Adresse email invalide')
    .custom(emailNotTaken)
    .withMessage('Cet email est déjà utilisé'),
  body('password')
    .isString()
    .isStrongPassword()
    .withMessage(
      'Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule et un caractère spécial.',
    ),
  body('birth_date')
    .isDate()
    .withMessage('Date de naissance invalide')
    .custom(isOverEighteen)
    .withMessage('Vous devez avoir au moins 18 ans pour vous inscrire'),
];

export default registerValidation;
