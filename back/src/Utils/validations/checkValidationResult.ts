import {Result, ValidationError, validationResult} from "express-validator";
import {MyRequest} from "../../Types/request";
import {NextFunction, Response} from "express";

// const hasFailedValidation = (
//   req: MyRequest,
//   res: Response
// ): Result<ValidationError> | boolean => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log("errors: ", errors);
//     res.status(400).send(errors);
//     return true;
//   }
//   return false;
// };

function CheckValidation(req: MyRequest, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    console.log("errors: ", errors);
    res.status(400).send(errors);
  }
}

export default CheckValidation;
