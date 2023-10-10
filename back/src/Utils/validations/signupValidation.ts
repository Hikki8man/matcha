import {body} from "express-validator";
import userService from "../../UserAccount/UserAccount.service";

const emailNotTaken = async (email: string) => {
  const userfound = await userService.get_by_email(email);

  if (userfound) {
    throw new Error("User already exist");
  }
  return true;
};

const isOverEighteen = (birth_date: Date) => {
  const birthDate = new Date(birth_date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age < 18) {
    throw new Error("You must be at least 18 years old.");
  }
  return true;
};

const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .custom(emailNotTaken)
    .withMessage("Email already exist"),
  body("password")
    .isString()
    .isLength({min: 3})
    .withMessage("Password must be at least 3 chars long"),
  body("birth_date")
    .isDate()
    .withMessage("Birth date must be a valid date")
    .custom(isOverEighteen)
    .withMessage("You must be at least 18 years old."),
];

export default signupValidation;
