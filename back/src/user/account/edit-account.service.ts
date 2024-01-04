import db from '../../database/connection';
import { Account } from '../../types/account';
import HttpError from '../../utils/HttpError';
import accountService from './account.service';

class EditAccountService {
  public accountRepo = () => db<Account>('account');

  public async editFirstname(id: number, firstname: string) {
    return await this.accountRepo()
      .update('firstname', firstname)
      .where('id', id);
  }

  public async editLastname(id: number, lastname: string) {
    return await this.accountRepo()
      .update('lastname', lastname)
      .where('id', id);
  }

  public async editUsername(id: number, username: string) {
    return await this.accountRepo()
      .update('username', username)
      .where('id', id);
  }

  public async editEmail(id: number, email: string) {
    return await this.accountRepo()
      .update({ email, verified: false })
      .where('id', id);
  }

  public async editPassword(
    id: number,
    old_password: string,
    new_password: string,
  ) {
    const account = await this.accountRepo()
      .select('id', 'password')
      .where('id', id)
      .first();
    if (!account) {
      throw new HttpError(404, 'User not found');
    }
    const valid_pass = await accountService.comparePassword(
      old_password,
      account.password!,
    );
    if (valid_pass === false) {
      throw new HttpError(401, 'Mot de passe incorrect');
    }
    await this.updatePassword(id, new_password);
  }

  public async updatePassword(id: number, new_password: string) {
    const password = await accountService.hashPassword(new_password);
    return await this.accountRepo().update({ password }).where('id', id);
  }
}

export default new EditAccountService();
