import {Result, ValidationError, validationResult} from "express-validator";
import {MyRequest} from "../../Types/request";
import {Response} from "express";

const hasFailedValidation = (
  req: MyRequest,
  res: Response
): Result<ValidationError> | boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors: ", errors);
    res.status(400).send(errors);
    return true;
  }
  return false;
};

export default hasFailedValidation;
