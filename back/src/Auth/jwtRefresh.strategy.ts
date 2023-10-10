import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {MyRequest} from "../Types/request";
import {env} from "../config";

function jwtRefreshStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const refresh_token = req.cookies.refresh_token;
  try {
    const user = jwt.verify(refresh_token, env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("refresh_token");
    res.status(403).send("Token expired");
  }
}

export default jwtRefreshStrategy;
