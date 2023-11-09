import bcrypt from 'bcrypt';
import db from '../../database/connection';
import { Account } from '../../types/account';
import HttpError from '../../utils/HttpError';
import { CompletedSteps, Gender, Profile } from '../../types/profile';
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
        .select('id', 'email', 'verified')
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

  //TODO move to authservice
  async validate_login(body: any) {
    try {
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
        .where('email', body.email)
        .first();
      if (!user) {
        throw new HttpError(400, 'User not found');
      }
      // const user: Account = await db.one(
      //   `SELECT id, email, verified, password FROM account WHERE email = $1`,
      //   body.email
      // );
      const res = await bcrypt.compare(body.password, user.password!);
      if (res === true) {
        delete user.password;
        return user;
      } else {
        return undefined;
      }
    } catch (e: any) {
      // console.log(err.message);
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
      const profile = await db<Profile>('profile').insert({
        id: account.id,
        name: body.firstname,
        birth_date: body.birth_date,
        completed_steps: CompletedSteps.Name,
      });
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

  // async get_likers(user_id: number) {
  //   try {
  //     const likers = await db.any(
  //       `SELECT u.*
  // 			   FROM profile u
  // 			   LEFT JOIN likes l ON u.id = l.liked_id
  // 			   WHERE l.liker_id = $1`,
  //       [user_id]
  //     );

  //     return likers;
  //   } catch (e: any) {
  //     console.error(e);
  //     return undefined;
  //   }
  // }
}

export default new AccountService();
