import bcrypt from 'bcrypt';
import db from '../../database/connection';
import { Account } from '../../types/account';
import HttpError from '../../utils/HttpError';
import { CompletedSteps, Profile } from '../../types/profile';
import { RegisterBody } from '../../types/registerBody';

class AccountService {
  private saltRounds = 10;
  public accountRepo = () => db<Account>('account');

  async get_by_id(id: number) {
    try {
      return await this.accountRepo()
        .select('id', 'email', 'verified', 'username', 'firstname', 'lastname')
        .where('id', id)
        .first();
    } catch (e: any) {
      console.error('Error', e.message);
      return undefined;
    }
  }

  async get_with_tokens(id: number) {
    try {
      return await this.accountRepo()
        .select(
          'id',
          'email',
          'verified',
          'token_validation',
          'forgot_password_token',
        )
        .where('id', id)
        .first();
    } catch (e: any) {
      console.error('Error', e.message);
      return undefined;
    }
  }

  async get_by_email(email: string) {
    try {
      return await this.accountRepo()
        .select('id', 'email', 'verified')
        .where('email', email)
        .first();
    } catch (e: any) {
      console.error('Error in get by email', e.message);
      return undefined;
    }
  }

  async get_by_username(username: string) {
    try {
      return await this.accountRepo()
        .select('id', 'email', 'verified')
        .where('username', username)
        .first();
    } catch (e: any) {
      console.error('Error in get by email', e.message);
      return undefined;
    }
  }

  async validate_login(username: string, password: string) {
    const account = await this.accountRepo()
      .select(
        'id',
        'username',
        'firstname',
        'lastname',
        'email',
        'verified',
        'password',
      )
      .where(db.raw('LOWER(username) = ?', [username.toLowerCase()]))
      .first();
    if (!account) {
      throw new HttpError(404, "Nom d'utilisateur ou mot de passe incorrect");
    }
    const res = await this.comparePassword(password, account.password!);
    if (res === true) {
      delete account.password;
      return account;
    } else {
      return undefined;
    }
  }

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  public async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async create(body: RegisterBody) {
    try {
      const hash = await this.hashPassword(body.password);
      const [account] = await this.accountRepo().insert(
        {
          username: body.username,
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          password: hash,
        },
        ['*'],
      );
      await db<Profile>('profile').insert({
        id: account.id,
        name: body.firstname,
        birth_date: body.birth_date,
        completed_steps: CompletedSteps.First,
      });
      await db('about').insert({ id: account.id });
      delete account.password;
      return account;
    } catch (e: any) {
      console.error(e.message);
      return undefined;
    }
  }

  async insert_validation_token(user: Account) {
    try {
      await this.accountRepo()
        .where({ id: user.id })
        .update({ token_validation: user.token_validation });
    } catch (e: any) {
      console.error('error in update: ', e.message);
    }
  }

  async set_verified(user_id: number) {
    try {
      const [account] = await this.accountRepo()
        .where({ id: user_id })
        .update({ token_validation: null, verified: true })
        .returning(['id', 'email', 'verified']);
      return account;
    } catch (e: any) {
      console.error('error in update: ', e.message);
    }
  }

  async set_forgot_password_token(user_id: number, token: string | null) {
    try {
      await this.accountRepo()
        .where({ id: user_id })
        .update({ forgot_password_token: token });
    } catch (e: any) {
      console.error('error in update: ', e.message);
    }
  }
}

export default new AccountService();
