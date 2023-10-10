import pgPromise from "pg-promise";

const pgp = pgPromise();
const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "matcha_db",
  user: "chak",
  password: "mdp",
};
const db = pgp(dbConfig);

export default db;
