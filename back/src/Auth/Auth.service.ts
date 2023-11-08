import jwt from 'jsonwebtoken';
import { UserAccount } from '../Types/UserAccount';
import userAccountService from '../UserAccount/UserAccount.service';
import emailerService from '../Emailer/Emailer.service';
import HttpError from '../Utils/HttpError';
import { env } from '../config';
import { MyJwtPayload } from '../Types/JwtPayload';

class AuthService {
  public signAccessToken(id: number) {
    return jwt.sign({ id }, env.TOKEN_SECRET, { expiresIn: '2m' });
  }

  public signRefreshToken(id: number) {
    return jwt.sign({ id }, env.TOKEN_SECRET, { expiresIn: '24h' });
  }

  public extractAccessToken(
    authHeader: string | undefined,
  ): string | undefined {
    const tokenSplited = authHeader?.split(' ');
    if (
      tokenSplited &&
      tokenSplited.length === 2 &&
      tokenSplited[0] === 'Bearer'
    ) {
      return tokenSplited[1];
    }
    return undefined;
  }

  public verifyToken(token: string): MyJwtPayload | undefined {
    try {
      return jwt.verify(token, env.TOKEN_SECRET, {
        ignoreExpiration: false,
      }) as MyJwtPayload;
    } catch (e) {
      return undefined;
    }
  }

  public async sendValidationMail(user: UserAccount) {
    user.token_validation = jwt.sign({ id: user.id }, env.TOKEN_SECRET, {
      expiresIn: '3d',
    });
    await userAccountService.insert_validation_token(user);
    await emailerService.sendValidationMail(user);
  }

  public async validateAccount(id: number, token: string) {
    const user_account = await userAccountService.get_with_token(id);
    if (!user_account) {
      console.log('User not found in validate account');
      throw new HttpError(404, 'User not found');
    }
    if (user_account.verified) {
      console.log('Account already verified');
      throw new HttpError(400, 'Account already verified');
    } else if (token !== user_account.token_validation) {
      throw new HttpError(400, 'Invalid token');
    }
    return await userAccountService.set_verified(id);
  }

  public generateAccessAndRefreshToken(id: number) {
    const access_token = this.signAccessToken(id);
    const refresh_token = this.signRefreshToken(id);
    return { access_token, refresh_token };
  }
}

export default new AuthService();
