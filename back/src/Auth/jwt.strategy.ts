import {Response, NextFunction} from "express";
import {MyRequest} from "../Types/request";
import authService from "./Auth.service";
import profileService from "../Profile/Profile.service";

function jwtStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const access_token: string = req.cookies.access_token;
  console.log("verify token", req.user_id);
  const payload = authService.verifyToken(access_token);
  console.log("payload", payload);
  if (payload) {
    req.user_id = payload.id;
    console.log("req.user", req.user_id);
    next();
  } else {
    console.log("access token expired");
    res.clearCookie("access_token");
    res.status(403).send("Invalid credential");
  }
}

export default jwtStrategy;
