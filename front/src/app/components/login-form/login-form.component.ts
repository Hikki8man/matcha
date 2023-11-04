import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { Credentials } from 'src/app/services/authentication/authentication.sevice';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

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
    public InvalidCredentials: boolean = false;

    constructor(
        private _authenticationService: IAuthenticationService,
        private _router: Router,
        private readonly _formBuilder: NonNullableFormBuilder,
    ) {}

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
        this.InvalidCredentials = false;
        if (this.loginForm.valid) {
            this.IsLoading = true;

            const credentials: Credentials = {
                email: this.loginForm.value.email!,
                password: this.loginForm.value.password!,
            };

            try {
                const response = await this._authenticationService.login(credentials);
                this._authenticationService.setProfile(response.profile);
                console.log('res login', response.profile);
                this._router.navigate([AppPathEnum.Search]);
                this.IsLoading = false;
            } catch (err: any) {
                console.log(err);
                this.IsLoading = false;
                this.InvalidCredentials = true;
            }
        }
    }
}
