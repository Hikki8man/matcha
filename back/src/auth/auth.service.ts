import jwt from 'jsonwebtoken';
import accountService from '../user/account/account.service';
import emailerService from '../emailer/emailer.service';
import HttpError from '../utils/HttpError';
import { env } from '../config';
import { MyJwtPayload } from '../types/jwtPayload';
import { Account } from '../types/account';

class AuthService {
  public signAccessToken(id: number) {
    return jwt.sign({ id }, env.TOKEN_SECRET, { expiresIn: '20h' });
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

  public async sendValidationMail(user: Account) {
    user.token_validation = jwt.sign({ id: user.id }, env.TOKEN_SECRET, {
      expiresIn: '3d',
    });
    await accountService.insert_validation_token(user);
    await emailerService.sendValidationMail(user);
  }

  public async verifyAccount(token: string) {
    console.log('token in verify', token);
    const payload = this.verifyToken(token);
    console.log('payload in verify', payload);
    if (!payload) {
      throw new HttpError(400, 'Invalid token');
    }
    const account = await accountService.get_with_token(payload.id);
    if (!account) {
      console.log('User not found in validate account');
      throw new HttpError(404, 'User not found');
    }
    if (account.verified) {
      console.log('Account already verified');
      throw new HttpError(400, 'Account already verified');
    } else if (token !== account.token_validation) {
      throw new HttpError(400, 'Invalid token');
    }
    return await accountService.set_verified(account.id);
  }

  public generateAccessAndRefreshToken(id: number) {
    const access_token = this.signAccessToken(id);
    const refresh_token = this.signRefreshToken(id);
    return { access_token, refresh_token };
  }

  public async forgotPassword(email: string) {
    const account = await accountService.get_by_email(email);
    if (!account) {
      throw new HttpError(404, 'Incorrect. Veuillez réessayer.');
    }
    const token = jwt.sign({ id: account.id }, env.TOKEN_SECRET, {
      expiresIn: '6h',
    });
    await emailerService.sendForgotPasswordMail(email, token);
  }
}

export default new AuthService();
