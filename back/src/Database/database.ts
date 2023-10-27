import Knex from "knex";

const db = Knex({
  client: "pg",
  // debug: true,
  connection: {
    host: "postgres",
    port: 5432,
    user: "chak",
    password: "mdp",
    database: "matchadb",
  },
});

export default db;
