import { ProfileModel } from './profile.model';

export interface UserModel {
    profile: ProfileModel;
    access_token: string;
}
