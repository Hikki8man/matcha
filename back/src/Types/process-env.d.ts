declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      TOKEN_SECRET: string;
      EMAIL: string;
      EMAIL_PASS: string;
      FRONT_URL: string;
    }
  }
}

export {};
