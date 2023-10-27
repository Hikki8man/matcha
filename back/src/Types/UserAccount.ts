export interface UserAccount {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  token_validation?: string;
  verified: boolean;
}
