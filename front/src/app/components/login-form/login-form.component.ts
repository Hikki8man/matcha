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
    public Errors: string[] = [];

    constructor(
        private readonly _authenticationService: IAuthenticationService,
        private readonly _router: Router,
        private readonly _formBuilder: NonNullableFormBuilder,
    ) {}

    public loginForm: FormGroup = this._formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required],
    });

    getErrorMessage(controlName: string): string {
        const control = this.loginForm.get(controlName);
        if (control?.hasError('required')) {
            return `${controlName} is required`;
        }
        return '';
    }

    public onLogin() {
        this.HasErrors = !this.loginForm.valid;
        this.Errors = [];
        if (this.loginForm.valid) {
            this.IsLoading = true;

            const credentials: Credentials = {
                username: this.loginForm.value.username!,
                password: this.loginForm.value.password!,
            };

            this._authenticationService.login(credentials).subscribe({
                next: () => {
                    this._router.navigate([AppPathEnum.Search]);
                    this.IsLoading = false;
                },
                error: (err) => {
                    console.log(err);
                    this.Errors = [err.error];
                    this.IsLoading = false;
                },
                complete() {},
            });
        }
    }
}
