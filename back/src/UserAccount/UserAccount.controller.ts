import express, {Request, Response, NextFunction} from "express";
import userAccountService from "./UserAccount.service";

class UserAccountController {
  public path = "/user";
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path + "/:id", this.getUserById);
  }

  getUserById = async (req: Request, res: Response) => {
    console.log("getting user");
    const user = await userAccountService.get_by_id(1);
    console.log("user", user);
    res.send(user);
  };
}

export default UserAccountController;
