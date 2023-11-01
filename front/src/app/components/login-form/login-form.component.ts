import { Component } from '@angular/core';
import {
    FormGroup,
    NonNullableFormBuilder,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { AccountData } from 'src/app/models/account.model';
import { ProfileData } from 'src/app/models/profile.model';
import { AuthService, Credentials } from 'src/app/services/auth.sevice';

export interface SuccessLoginData {
    profile: ProfileData;
    account: AccountData;
}

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
        width: '14px',
    };

    public HasErrors: boolean = false;
    public IsLoading: boolean = false;

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private readonly _formBuilder: NonNullableFormBuilder,
    ) { }

    public loginForm: FormGroup = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
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

    public async onLogin() {
        this.HasErrors = !this.loginForm.valid;
        if (this.loginForm.valid) {
            this.IsLoading = true;

            const credentials: Credentials = {
                email: this.loginForm.value.email!,
                password: this.loginForm.value.password!,
            };

            let response;
            try {
                response = await this._authService.login(credentials);
                console.log(response);
            } catch (err: any) {
                console.log(err);
                this.IsLoading = false;
            }

            this.IsLoading = false;

            if (response?.profile)
            this._router.navigate(['search']);
        }
        console.log('onLogin');
        console.log('login: ' + this.loginForm.value.email);
        console.log('password: ' + this.loginForm.value.password);
    }
}
