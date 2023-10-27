import {JwtPayload} from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  id: number;
}
