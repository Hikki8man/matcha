import 'dotenv/config';

export interface Env {
  TOKEN_SECRET: string;
  EMAIL: string;
  EMAIL_PASS: string;
  FRONT_URL: string;
}

export function loadEnv(): Env {
  console.log('loading env');
  for (const env of requiredEnv) {
    if (!process.env[env]) {
      console.error(`Error: Environment variable ${env} is not defined.`);
      process.exit(1); //todo throw?
    }
  }

  return {
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    EMAIL: process.env.EMAIL!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    FRONT_URL: process.env.FRONT_URL!,
  };
}

export const requiredEnv = ['TOKEN_SECRET', 'EMAIL', 'EMAIL_PASS', 'FRONT_URL'];
