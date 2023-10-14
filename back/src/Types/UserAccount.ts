export interface UserAccount {
  id: number;
  email: string;
  password?: string;
  token_validation?: string;
  verified: boolean;
}
