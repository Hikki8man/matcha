import { UserModel } from 'src/app/models/user.model';
import { Credentials } from './authentication.sevice';
import { Observable } from 'rxjs';
import { ProfileModel } from 'src/app/models/profile.model';

export abstract class IAuthenticationService {
    public abstract get userValue(): UserModel | undefined;
    public abstract get profileValue(): ProfileModel | undefined;
    public abstract register(form: any): Observable<UserModel>;
    public abstract login(credentials: Credentials): Observable<UserModel>;
    public abstract logout(): void;
    public abstract refreshToken(): Observable<{ access_token: string }>;
    public abstract refreshPage(): Observable<UserModel>;
    public abstract isAuthenticatedGuard(): boolean;
    public abstract isNotAuthenticatedGuard(): boolean;
    public abstract setUser(user: UserModel): void;
}
