import {Response, NextFunction} from "express";
import {MyRequest} from "../Types/request";
import authService from "./Auth.service";

function jwtStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const access_token: string = req.cookies.access_token;
  const payload = authService.verifyToken(access_token);
  if (payload) {
    req.user = payload;
  } else {
    console.log("access token expired");
    res.clearCookie("access_token");
    res.status(403).send("Token expired");
  }
}

export default jwtStrategy;
