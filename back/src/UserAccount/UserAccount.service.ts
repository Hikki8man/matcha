import bcrypt from 'bcrypt';
import db from '../Database/database';
import { UserAccount } from '../Types/UserAccount';
import HttpError from '../Utils/HttpError';
import { Profile } from '../Types/Profile';

class UserAccountService {
  private saltRounds = 10;
  constructor() {
    console.log('user acc construct');
  }
  async get_by_id(id: number) {
    try {
      return await db<UserAccount>('user_account')
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
      return await db<UserAccount>('user_account')
        .select('id', 'email', 'verified', 'token_validation')
        .where('id', id)
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }

  async get_by_email(email: string): Promise<UserAccount | undefined> {
    try {
      return await db<UserAccount>('user_account')
        .select('id', 'email', 'verified')
        .where('email', email)
        .first();
      // return await db.one(
      //   `SELECT id, email, verified FROM user_account WHERE email = $1`,
      //   email
      // );
    } catch (e: any) {
      console.log('Error in get by email', e.message);
      return undefined;
    }
  }

  //TODO move to authservice
  async validate_login(body: any): Promise<UserAccount | undefined> {
    try {
      const user: UserAccount | undefined = await db<UserAccount>(
        'user_account',
      )
        .select('id', 'email', 'verified', 'password')
        .where('email', body.email)
        .first();
      if (!user) {
        throw new HttpError(400, 'User not found');
      }
      // const user: UserAccount = await db.one(
      //   `SELECT id, email, verified, password FROM user_account WHERE email = $1`,
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
  async create(body: any) {
    const { name, birth_date, gender, email, password } = body;
    const hash = await bcrypt.hash(password, this.saltRounds);
    try {
      const [user_account] = await db<UserAccount>('user_account').insert(
        {
          email: email,
          password: hash,
        },
        ['*'],
      );
      // Insert user's profile information into the 'PROFILE' table
      const profile = await db<Profile>('profile').insert({
        id: user_account.id,
        name: name,
        birth_date: birth_date,
        gender: gender,
      });
      delete user_account.password;
      return user_account;
    } catch (e: any) {
      console.log(e.message);
      return undefined;
    }
  }

  async insert_validation_token(user: UserAccount) {
    try {
      db<UserAccount>('user_account')
        .where({ id: user.id })
        .update({ token_validation: user.token_validation });
    } catch (e: any) {
      console.log('error in update: ', e.message);
    }
  }

  async set_verified(user_id: number) {
    try {
      const [user_account] = await db<UserAccount>('user_account')
        .where({ id: user_id })
        .update({ token_validation: undefined, verified: true })
        .returning(['id', 'email', 'verified']);
      //TODO why?
      return user_account;
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

export default new UserAccountService();
