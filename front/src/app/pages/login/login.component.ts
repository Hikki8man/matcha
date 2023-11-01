import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from 'src/app/services/authentication/authentication.sevice';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    constructor(
        private _authenticationService: IAuthenticationService,
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
                const res = await this._authenticationService.login(credentials);
                console.log('res', res);
            } catch (err: any) {}
        }
        console.log('onLogin');
        console.log('login: ' + this.loginForm.value.email);
        console.log('password: ' + this.loginForm.value.password);
    }
}
