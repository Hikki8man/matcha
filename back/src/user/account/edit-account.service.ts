import db from '../../database/connection';
import { Account } from '../../types/account';

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
}

export default new EditAccountService();
