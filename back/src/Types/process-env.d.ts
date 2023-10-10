declare global {
  declare namespace NodeJS {
    export interface ProcessEnv {
      TOKEN_SECRET: string;
      EMAIL: string;
      EMAIL_PASS: string;
    }
  }
}

export {};
