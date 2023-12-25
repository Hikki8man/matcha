import Knex from 'knex';
import { env } from '../config';

const db = Knex({
  client: 'pg',
  connection: {
    host: 'postgres',
    port: 5432,
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
  },
});

export default db;
