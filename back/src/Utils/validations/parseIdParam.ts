import {Response, NextFunction} from "express";
import {MyRequest} from "../../Types/request";

function ParseParamId(req: MyRequest, res: Response, next: NextFunction) {
  const id = req.params.id;
  const id_parsed = parseInt(id, 10);

  if (isNaN(id_parsed) || id_parsed.toString() !== id) {
    return res.status(400).send("Invalid ID parameter. Must be an integer.");
  }
  req.id_parsed = id_parsed;
  next();
}

export default ParseParamId;
