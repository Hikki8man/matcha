import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountData } from 'src/app/models/account.model';
import { ProfileData } from 'src/app/models/profile.model';
import { AuthService, Credentials } from 'src/app/services/auth.sevice';

export interface SuccessLoginData {
    profile: ProfileData;
    account: AccountData;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _router: Router,
    ) {}

    loginForm = new FormGroup({
        email: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    getErrorMessage(controlName: string): string {
        const control = this.loginForm.get(controlName);
        if (control?.hasError('required')) {
            return `${controlName} is required`;
        } else if (control?.hasError('email')) {
            return 'Invalid email address';
        }
        return '';
    }

    onLogin() {
        if (this.loginForm.valid) {
            const credentials: Credentials = {
                email: this.loginForm.value.email!,
                password: this.loginForm.value.password!,
            };
            this._authService.login(credentials).subscribe({
                next: (value) => {
                    console.log('value', value);
                    this._authService.setAuth(true, value);
                    this._router.navigate(['search']);
                },
                error: (err) => console.log('error: ', err),
                complete: () => console.log('complete ?'),
            });
        }
        console.log('onLogin');
        console.log('login: ' + this.loginForm.value.email);
        console.log('password: ' + this.loginForm.value.password);
    }
}
