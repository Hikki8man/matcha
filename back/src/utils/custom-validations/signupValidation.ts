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
  const birthDate = new Date(birth_date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

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
    .isLength({ min: 3 })
    .withMessage('Le mot de passe doit contenir au moins 3 caractères'),
  body('birth_date')
    .isDate()
    .withMessage('Date de naissance invalide')
    .custom(isOverEighteen)
    .withMessage('Vous devez avoir au moins 18 ans pour vous inscrire'),
];

export default registerValidation;
