import { ProfileModel } from 'src/app/models/profile.model';
import { UserModel } from 'src/app/models/user.model';
import { Credentials } from './authentication.sevice';

export abstract class IAuthenticationService {
    public abstract register(form: any): Promise<UserModel>;
    public abstract login(credentials: Credentials): Promise<UserModel>;
    public abstract refreshToken(): Promise<UserModel>;
    public abstract getProfile(): ProfileModel | null;
    public abstract setProfile(profile: ProfileModel): void;

    public abstract isAuthenticatedGuard(): Promise<boolean>;
}
