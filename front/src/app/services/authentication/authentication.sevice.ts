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
    private _profile: ProfileModel;

    constructor(
        private router: Router,
        private _apiService: IApiService,
    ) {}

    public register(form: any): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/register', 'POST', form);
    }

    public login(credentials: Credentials): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/login', 'POST', credentials);
    }

    public refreshToken(): Promise<UserModel> {
        return this._apiService.callApi<UserModel>('auth/refresh', 'GET');
    }

    public async isAuthenticatedGuard(): Promise<boolean> {
        const isAuth = this.isAuthenticated();
        console.log('AuthGuard: ', isAuth);
        if (isAuth) {
            return true;
        }
        try {
            const profile = await this.refreshToken();
            this.setProfile(profile.profile);
            return true;
        } catch (error) {
            console.log(error);
        }
        this.router.navigate([AppPathEnum.Login]);
        return false;
    }

    public getProfile(): ProfileModel {
        return this._profile;
    }

    public setProfile(profile: ProfileModel): void {
        this._profile = profile;
    }

    private isAuthenticated() {
        return this._profile !== undefined;
    }
}
