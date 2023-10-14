import {Request} from "express";
import {Profile} from "./Profile";

export interface MyRequest extends Request {
  user_id?: number;
  profile?: Profile;
  id_parsed?: number;
}
