const bcrypt = require("bcrypt");
const db = require("../dbconnect");
const saltRounds = 10;

class UserAccountRepository {
  async get_by_id(id) {
    try {
      return await db.one(
        `SELECT id, email, verified FROM user_account WHERE id = $1`,
        id
      );
    } catch (e) {
      console.log("Error", e.message);
      return undefined;
    }
  }

  async get_with_token(id) {
    try {
      return await db.one(
        `SELECT id, email, token_validation, verified FROM user_account WHERE id = $1`,
        id
      );
    } catch (e) {
      console.log("Error", e.message);
      return undefined;
    }
  }

  async get_by_email(email) {
    try {
      return await db.one(
        `SELECT id, email, verified FROM user_account WHERE email = $1`,
        email
      );
    } catch (e) {
      console.log("Error in get by email", e.message);
      return undefined;
    }
  }

  async validate_login(body) {
    try {
      const user = await db.one(
        `SELECT id, email, verified, password FROM user_account WHERE email = $1`,
        body.email
      );
      const res = await bcrypt.compare(body.password, user.password);
      if (res === true) {
        delete user.password;
        return user;
      } else {
        return undefined;
      }
    } catch (err) {
      // console.log(err.message);
      return undefined;
    }
  }

  //TODO validator
  async create(body) {
    const {name, birth_date, gender, email, password} = body;
    const hash = await bcrypt.hash(password, saltRounds);
    try {
      const user_account = await db.one(
        `INSERT INTO user_account (email, password) VALUES ($1, $2) RETURNING *`,
        [email, hash]
      );
      // Insert user's profile information into the 'PROFILE' table
      const profile = await db.one(
        `INSERT INTO profile (user_id, name, birth_date, gender, completed_steps) VALUES ($1, $2, $3, $4, $5)`,
        [user_account.id, name, birth_date, gender, "name"] //todo ts enum?
      );
      // console.log("profile", profile);
      delete user_account.password;
      return user_account;
    } catch (e) {
      console.log(e.message);
      return undefined;
    }
  }

  async insert_validation_token(user_id, token) {
    try {
      await db.none(
        `UPDATE user_account SET token_validation = $1 WHERE id = $2`,
        [token, user_id]
      );
    } catch (e) {
      console.log("error in update: ", e.message);
    }
  }

  async set_verified(user_id) {
    try {
      const user_account = await db.one(
        `UPDATE user_account SET token_validation = NULL, verified = TRUE  WHERE id = $1 RETURNING email, verified`,
        [user_id]
      );
      return user_account;
    } catch (e) {
      console.log("error in update: ", e.message);
    }
  }

  async get_likers(user_id) {
    try {
      const likers = await db.any(
        `SELECT u.*
			   FROM profile u
			   LEFT JOIN likes l ON u.id = l.liked_id
			   WHERE l.liker_id = $1`,
        [user_id]
      );

      return likers;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

module.exports = new UserAccountRepository();
