import { body } from 'express-validator';
import userService from '../../UserAccount/UserAccount.service';

// const emailNotTaken = (email: string) => {
//   const userfound = userService.get_by_email(email);
//   console.log('mail taken', userfound);
//   console.log('ret', userfound !== undefined ? false : true);
//   return userfound ? false : true;
// };

// const usernameNotTaken = async (username: string) => {
//   const userfound = await userService.get_by_username(username);
//   console.log('user taken', userfound);
//   return userfound ? false : true;
// };

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
    .withMessage('User must be at least 1 char long')
    .custom(async (username) => {
      const userfound = await userService.get_by_username(username);
      console.log('mail taken', userfound);
      console.log('ret', userfound !== undefined ? false : true);
      if (userfound) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Username already taken'),
  body('firstname').isString(),
  body('lastname').isString(),
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .custom(async (email) => {
      const userfound = await userService.get_by_email(email);
      console.log('mail taken', userfound);
      console.log('ret', userfound !== undefined ? false : true);
      if (userfound) {
        return Promise.reject();
      }
      return true;
    })
    .withMessage('Email already exist'),
  body('password')
    .isString()
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 chars long'),
  body('birth_date')
    .isDate()
    .withMessage('Birth date must be a valid date')
    .custom(isOverEighteen)
    .withMessage('You must be at least 18 years old.'),
];

export default registerValidation;
