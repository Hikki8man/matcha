// import { body } from 'express-validator';
import userService from '../../user/account/account.service';
import { body } from '../middleware/validator/body';
// import {
//   body,
//   custom,
//   isDate,
//   isEmail,
//   isLength,
//   isString,
// } from '../middleware/validator';

const emailNotTaken = async (email: string) => {
  const userfound = await userService.get_by_email(email);
  return userfound ? false : true;
};

const usernameNotTaken = async (username: string) => {
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
    .withMessage('User must be at least 1 char long')
    .custom(usernameNotTaken)
    .withMessage('Username already taken'),
  body('firstname').isString(),
  body('lastname').isString(),
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .custom(emailNotTaken)
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

// const registerValidation = [
//   body('username', [
//     isString(),
//     isLength({ min: 1 }, 'Username must be at least 1 char long'),
//     custom({
//       validator: async (username: string) => {
//         const userfound = await userService.get_by_username(username);
//         if (userfound) {
//           return false;
//         }
//         return true;
//       },
//       message: 'Username already taken',
//     }),
//   ]),
//   body('firstname', [isString()]),
//   body('lastname', [isString()]),
//   body('email', [
//     isEmail(),
//     custom({
//       validator: async (email: string) => {
//         const userfound = await userService.get_by_email(email);
//         if (userfound) {
//           return false;
//         }
//         return true;
//       },
//       message: 'Email already taken',
//     }),
//   ]),
//   body('password', [
//     isString(),
//     isLength({ min: 3 }, 'Password must be at least 3 chars long'),
//   ]),
//   body('birth_date', [
//     isDate(),
//     custom({
//       validator: isOverEighteen,
//       message: 'You must be at least 18 years old.',
//     }),
//   ]),
// ];

export default registerValidation;
