import { Component } from '@angular/core';
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
    selector: 'forgot-password-form',
    templateUrl: './forgot-password-form.component.html',
    styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
        width: '14px',
    };
    public forgotPassForm: FormGroup = this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
    });
    public IsLoading: boolean = false;
    public HasErrors: boolean = false;
    public Errors: string[] = [];

    constructor(
        private readonly _formBuilder: NonNullableFormBuilder,
        private readonly _apiService: IApiService,
        private readonly _toastService: HotToastService,
        private readonly _router: Router,
    ) {}

    getErrorMessage(): string {
        const control = this.forgotPassForm.get('email');
        if (control.hasError('required')) {
            return `Adresse email requis`;
        } else if (control.hasError('email')) {
            return 'Adresse email invalide';
        }
        return '';
    }

    public onForgotPassword() {
        this.HasErrors = !this.forgotPassForm.valid;
        this.Errors = [];
        if (this.forgotPassForm.valid) {
            this.IsLoading = true;
            const email = this.forgotPassForm.value.email!;
            this._apiService.callApi('auth/forgot-password', 'POST', { email }).subscribe({
                error: (err) => {
                    if (Array.isArray(err.error)) {
                        this.Errors = err.error.map((x: any) => x.msg);
                    } else {
                        this.Errors = [err.error];
                    }
                    this.IsLoading = false;
                },
                complete: () => {
                    this.IsLoading = false;
                    this._toastService.success('Un email vous a été envoyé');
                    this._router.navigate([AppPathEnum.Login]);
                },
            });
        }
    }
}
