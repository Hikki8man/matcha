import db from '../../database/connection';
import { Account } from '../../types/account';
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

  public async updatePassword(id: number, new_password: string) {
    const password = await accountService.hashPassword(new_password);
    return await this.accountRepo().update({ password }).where('id', id);
  }
}

export default new EditAccountService();
