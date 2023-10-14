import {Response, NextFunction} from "express";
import {MyRequest} from "../Types/request";
import authService from "./Auth.service";

function jwtRefreshStrategy(req: MyRequest, res: Response, next: NextFunction) {
  const refresh_token: string = req.cookies.refresh_token;
  const payload = authService.verifyToken(refresh_token);
  if (payload) {
    req.user = payload;
  } else {
    console.log("refresh token expired");
    res.clearCookie("access_token");
    res.status(403).send("Token expired");
  }
}

export default jwtRefreshStrategy;
