import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Profile } from '../models/profile.model';
import { SuccessLoginData } from '../pages/login/login.component';
import { IApiService } from './iapi.service';

export interface Credentials {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    //TODO in session service
    private _authenticated: boolean;
    private _profile: Profile;

    constructor(
        private _socket: Socket,
        private router: Router,
        private _apiService: IApiService,
    ) {
        // this._auth = new Observable((auth) => {
        //     console.log('setting auth observable');
        //     auth.next(false);
        // });
        this._authenticated = false;
    }

    setAuth(isAuth: boolean, data: SuccessLoginData) {
        console.log('setAuth: ', data);
        this._authenticated = isAuth;
        this._profile = new Profile(data.profile);
        this._socket.connect();
    }

    getAuth() {
        return {
            isAuth: this._authenticated,
            profile: this._profile,
        };
    }

    isAuth() {
        return this._authenticated;
    }

    register(form: any) {
        return this._apiService.callApi<SuccessLoginData>('auth/register', 'POST', form);
    }

    // login(credentials: Credentials) {

    login(credentials: Credentials) {
        return this._apiService.callApi<SuccessLoginData>('auth/login', 'POST', credentials);
    }

    refreshToken() {
        return this._apiService.callApi<SuccessLoginData>('auth/refresh', 'GET');
    }

    authGuard() {
        const isAuth = this.isAuth();
        console.log('AuthGuard: ', isAuth);
        if (isAuth) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
