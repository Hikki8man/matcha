import { AccountModel } from './account.model';
import { ProfileModel } from './profile.model';

export interface UserModel {
    profile: ProfileModel;
    account: AccountModel;
    access_token: string;
}
