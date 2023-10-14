import pgPromise from "pg-promise";
import Knex from "knex";

const db = Knex({
  client: "pg",
  debug: true,
  connection: {
    host: "postgres",
    port: 5432,
    user: "chak",
    password: "mdp",
    database: "matcha_db",
  },
});

// Now you can use `knex` with TypeScript support

// const pgp = pgPromise();
// const dbConfig = {
//   host: "postgres",
//   port: 5432,
//   database: "matcha_db",
//   user: "chak",
//   password: "mdp",
// };
// const db = pgp(dbConfig);

// const knex = require('knex')({
//   client: 'postgres',
//   connection: {
//     host : 'postgres',
//     port : 5432,
//     user : 'chak',
//     password : 'mdp',
//     database : 'matcha_db'
//   }
// });

export default db;
