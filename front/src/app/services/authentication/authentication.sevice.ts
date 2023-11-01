import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { ProfileModel } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IAuthenticationService } from './iauthentication.service';
import { AppPathEnum } from 'src/app/enums/app-path-enum';

export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService implements IAuthenticationService {
    //TODO in session service
    private _authenticated: boolean;

    constructor(
        private router: Router,
        private _apiService: IApiService,
    ) {
        this._authenticated = false;
    }

    public register(form: any): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/register', 'POST', form);
    }

    public login(credentials: Credentials): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/login', 'POST', credentials);
    }

    public refreshToken(): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/refresh', 'GET');
    }

    public isAuthenticatedGuard(): boolean {
        const isAuth = this.isAuthenticated();
        console.log('AuthGuard: ', isAuth);
        if (isAuth) {
            return true;
        }
        this.router.navigate([AppPathEnum.Login]);
        return false;
    }

    public getCurrentUser(): Promise<ProfileModel> {
        return this._apiService.callApi('/auth/me', 'GET');
    }

    private isAuthenticated() {
        return this._authenticated;
    }
}
