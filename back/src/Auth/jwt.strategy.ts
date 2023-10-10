import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {MyRequest} from "../Types/request";
import {env} from "../config";

function jwtStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const access_token = req.cookies.access_token;
  try {
    const user = jwt.verify(access_token, env.TOKEN_SECRET);
    req.user = user;
    console.log("'user' in jwt", user);
    next();
  } catch (err) {
    console.log("access token expired");
    res.clearCookie("access_token");
    res.status(403).send("Token expired");
  }
}

export default jwtStrategy;
