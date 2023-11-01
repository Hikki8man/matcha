import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
        private _authService: AuthService,
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

    async onLogin() {
        if (this.loginForm.valid) {
            const credentials: Credentials = {
                email: this.loginForm.value.email!,
                password: this.loginForm.value.password!,
            };
            try {
                const res = await this._authService.login(credentials);
                console.log('res', res);
            } catch (err: any) {}
        }
        console.log('onLogin');
        console.log('login: ' + this.loginForm.value.email);
        console.log('password: ' + this.loginForm.value.password);
    }
}
