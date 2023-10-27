import { Injectable, OnInit } from '@angular/core';
import { Profile } from '../models/profile.model';
import { SuccessLoginData } from '../components/login/login.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

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
    private _auth: Observable<boolean>;
    private _profile: Profile;

    constructor(
        private _socket: Socket,
        private router: Router,
        private _http: HttpClient,
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
        return this._http.post('http://localhost:8080/auth/register', form);
    }

    login(credentials: Credentials) {
        return this._http.post<SuccessLoginData>('http://localhost:8080/auth/login', credentials, {
            withCredentials: true,
        });
    }

    refreshToken() {
        return this._http.get<SuccessLoginData>('http://localhost:8080/auth/refresh', {
            withCredentials: true,
        });
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
