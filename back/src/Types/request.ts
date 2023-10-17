import {Request} from "express";
import {Profile} from "./Profile";
import {ParamsDictionary} from "express-serve-static-core";

export interface MyRequest extends Request {
  params: ParamsDictionary & {id?: number};
  user_id?: number;
  profile?: Profile;
  // id_parsed?: number;
}
