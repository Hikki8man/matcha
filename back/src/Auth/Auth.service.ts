import jwt from "jsonwebtoken";
import {UserAccount} from "../Types/UserAccount";
import userAccountService from "../UserAccount/UserAccount.service";
import emailerService from "../Emailer/Emailer.service";
import HttpError from "../Utils/HttpError";
import {env} from "../config";

class AuthService {
  public signToken(payload: any, option?: jwt.SignOptions) {
    return jwt.sign(payload, env.TOKEN_SECRET, option);
  }

  public async sendValidationMail(user: UserAccount) {
    user.token_validation = this.signToken({id: user.id}, {expiresIn: "3d"});
    await userAccountService.insert_validation_token(user);
    await emailerService.sendValidationMail(user);
  }

  public async validateAccount(id: number, token: string) {
    const user_account = await userAccountService.get_with_token(id);
    if (!user_account) {
      console.log("User not found in validate account");
      throw new HttpError(404, "User not found");
    }
    if (user_account.verified) {
      console.log("Account already verified");
      throw new HttpError(400, "Account already verified");
    } else if (token !== user_account.token_validation) {
      throw new HttpError(400, "Invalid token");
    }
    return await userAccountService.set_verified(id);
  }

  public generateAccessAndRefreshToken(user_account: UserAccount) {
    const access_token = this.signToken(
      {id: user_account.id},
      {expiresIn: "4h"}
    );
    const refresh_token = this.signToken(
      {id: user_account.id},
      {expiresIn: "1d"}
    );
    return {access_token, refresh_token};
  }
}

export default new AuthService();
