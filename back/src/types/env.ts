import 'dotenv/config';

export interface Env {
  TOKEN_SECRET: string;
  EMAIL: string;
  EMAIL_PASS: string;
  FRONT_URL: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

export function loadEnv(): Env {
  for (const env of requiredEnv) {
    if (!process.env[env]) {
      console.error(`Error: Environment variable ${env} is not defined.`);
      process.exit(1);
    }
  }

  return {
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    EMAIL: process.env.EMAIL!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    FRONT_URL: process.env.FRONT_URL!,
    POSTGRES_DB: process.env.POSTGRES_DB!,
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  };
}

export const requiredEnv = [
  'TOKEN_SECRET',
  'EMAIL',
  'EMAIL_PASS',
  'FRONT_URL',
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
];
