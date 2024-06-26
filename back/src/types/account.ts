export interface Account {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  token_validation: string | null;
  forgot_password_token: string | null;
  verified: boolean;
}
