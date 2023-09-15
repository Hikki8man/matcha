const pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'matcha_db',
	user: 'chak',
	password: 'mdp',
};

const db = pgp(dbConfig);

db.connect()
	.then(() => {
		console.log("Connected to database");
	})
	.catch((error) => {
		console.error("Failed to connect to database: ", error);
	})

module.exports = db;