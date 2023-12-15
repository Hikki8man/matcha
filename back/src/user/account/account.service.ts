import bcrypt from 'bcrypt';
import db from '../../database/connection';
import { Account } from '../../types/account';
import HttpError from '../../utils/HttpError';
import { CompletedSteps, Profile } from '../../types/profile';
import { RegisterBody } from '../../types/registerBody';

class AccountService {
  private saltRounds = 10;
  public accountRepo = () => db<Account>('account');
  constructor() {
    console.log('user acc construct');
  }
  async get_by_id(id: number) {
    try {
      return await this.accountRepo()
        .select('id', 'email', 'verified', 'username', 'firstname', 'lastname')
        .where('id', id)
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }

  async get_with_token(id: number) {
    try {
      return await this.accountRepo()
        .select('id', 'email', 'verified', 'token_validation')
        .where('id', id)
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
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
      console.log('Error in get by email', e.message);
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
      console.log('Error in get by email', e.message);
      return undefined;
    }
  }

  async validate_login(username: string, password: string) {
    const user = await this.accountRepo()
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
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    if (user.verified === false) {
      throw new HttpError(401, 'Account not verified');
    }
    const res = await bcrypt.compare(password, user.password!);
    if (res === true) {
      delete user.password;
      return user;
    } else {
      return undefined;
    }
  }

  //TODO validator
  async create(body: RegisterBody) {
    const hash = await bcrypt.hash(body.password, this.saltRounds);
    try {
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
      // Insert user's profile information into the 'PROFILE' table
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
      console.log(e.message);
      return undefined;
    }
  }

  async insert_validation_token(user: Account) {
    try {
      this.accountRepo()
        .where({ id: user.id })
        .update({ token_validation: user.token_validation });
    } catch (e: any) {
      console.log('error in update: ', e.message);
    }
  }

  async set_verified(user_id: number) {
    try {
      const [account] = await this.accountRepo()
        .where({ id: user_id })
        .update({ token_validation: undefined, verified: true })
        .returning(['id', 'email', 'verified']);
      //TODO why?
      return account;
    } catch (e: any) {
      console.log('error in update: ', e.message);
    }
  }
}

export default new AccountService();
