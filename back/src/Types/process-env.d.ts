declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      TOKEN_SECRET: string;
      EMAIL: string;
      EMAIL_PASS: string;
      FRONT_URL: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
    }
  }
}

export {};
