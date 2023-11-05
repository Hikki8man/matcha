import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { ProfileModel } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IAuthenticationService } from './iauthentication.service';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { Observable, catchError, from, map, of } from 'rxjs';

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

    public isAuthenticatedGuard(): Observable<ProfileModel | undefined> {
        const isAuth = this.isAuthenticated();
        console.log('isAuth ===', isAuth);

        if (isAuth) {
            return of(this._profile);
        }

        return from(this.refreshToken()).pipe(
            map((profile) => {
                this._profile = profile.profile;
                console.log('setting profile', this._profile);
                return this._profile;
            }),
            catchError((error) => {
                console.log('refresh expired', error);
                this.router.navigate([AppPathEnum.Login]);
                return of(undefined);
            }),
        );
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
