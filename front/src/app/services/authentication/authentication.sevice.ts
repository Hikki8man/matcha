import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { UserModel } from 'src/app/models/user.model';
import { ProfileModel } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { ISocketService } from '../socket/isocket.service';
import { IAuthenticationService } from './iauthentication.service';

export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService implements IAuthenticationService {
    private _userSubject: BehaviorSubject<UserModel | undefined>;
    private _refreshTokenTimeout?: NodeJS.Timeout;
    // public user: Observable<UserModel | undefined>;

    constructor(
        private _router: Router,
        private _apiService: IApiService,
        private _socketService: ISocketService,
    ) {
        this._userSubject = new BehaviorSubject<UserModel | undefined>(undefined);
        // this.user = this._userSubject.asObservable();
    }

    public get userValue(): UserModel | undefined {
        return this._userSubject.value;
    }

    public get profileValue(): ProfileModel | undefined {
        return this._userSubject.value?.profile;
    }

    public register(form: any): Observable<UserModel> {
        return this._apiService.callApi<UserModel>('auth/register', 'POST', form);
    }

    public login(credentials: Credentials): Observable<UserModel> {
        return this._apiService
            .callApiWithCredentials<UserModel>('auth/login', 'POST', credentials)
            .pipe(
                map((user) => {
                    this._userSubject.next(user);
                    this.startRefreshTokenTimer(user.access_token);
                    this._socketService.connect(user.access_token);
                    return user;
                }),
            );
    }

    public logout(): void {
        this._userSubject.next(undefined);
        this._apiService.callApiWithCredentials('auth/logout', 'POST').subscribe();
        this.stopRefreshTokenTimer();
        this._socketService.disconnect();
        this._router.navigate([AppPathEnum.Login]);
    }

    public refreshToken(): Observable<{ access_token: string }> {
        return this._apiService
            .callApiWithCredentials<{ access_token: string }>('auth/refresh-token', 'GET')
            .pipe(
                map((token) => {
                    if (this._userSubject.value) {
                        this._userSubject.next({
                            ...this._userSubject.value,
                            access_token: token.access_token,
                        });
                        this.startRefreshTokenTimer(token.access_token);
                    }
                    // this._userSubject.next(user);
                    return token;
                }),
            );
    }

    public refreshPage(): Observable<UserModel> {
        return this._apiService.callApiWithCredentials<UserModel>('auth/refresh-page', 'GET').pipe(
            map((user) => {
                this._userSubject.next(user);
                this.startRefreshTokenTimer(user.access_token);
                return user;
            }),
        );
    }

    public setUser(user: UserModel): void {
        this._userSubject.next(user);
    }

    public isAuthenticatedGuard(): boolean {
        const isAuth = this.userValue;
        console.log('isAuth ===', isAuth ? true : false);

        if (isAuth) {
            return true;
        } else {
            this._router.navigate([AppPathEnum.Login]);
            return false;
        }
    }

    private startRefreshTokenTimer(token: string) {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = token.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60 * 1000;
        if (timeout > 0) {
            this._refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
        }
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this._refreshTokenTimeout);
    }
}
