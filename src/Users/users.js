const bcrypt = require('bcrypt');
const { result } = require('../dbconnect');
const saltRounds = 10;

class UserRepository {
	constructor(db) {
		this.db = db;
	}
	async get_by_id(id) {
		try {
			return await this.db.one(`SELECT firstname, lastname, age, gender, email FROM users WHERE id = $1`, id);
		}
		catch {
			return undefined;
		}
	}

	async get_by_email_w_pwd(email) {
		try {
			return await this.db.one(`SELECT * FROM users WHERE email = $1`, email);
		}
		catch {
			return undefined;
		}
	}

	async validate_login(body) {
		try {
			const user = await this.db.one(`SELECT * FROM users WHERE email = $1`, body.email);
			const res = await bcrypt.compare(body.password, user.password);
			if (res === true) {
				delete user.password;
				return user;
			}
			else {
				return undefined;
			}
		}
		catch (err) {
			console.log(err);
			return undefined;
		}
	}

	async create(body) {
		const { firstname, lastname, age, gender, email, password } = body;
		const hash = await bcrypt.hash(password, saltRounds)
		return this.db.one(`INSERT INTO users (firstname, lastname, age, gender, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[firstname, lastname, age, gender, email, hash]);
	}

	async get_likers(user_id) {
		try {
			const likers = await this.db.any(
			  `SELECT u.*
			   FROM users u
			   INNER JOIN likes l ON u.id = l.liked_id
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

module.exports = UserRepository;