import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
    selector: 'reset-password-form',
    templateUrl: './reset-password-form.component.html',
    styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent implements OnInit {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
        width: '14px',
    };
    public resetPassForm: FormGroup = this._formBuilder.group({
        password: ['', [Validators.required]],
    });
    public IsLoading: boolean = false;
    public HasErrors: boolean = false;
    public Errors: string[] = [];
    private _token: string | undefined = undefined;

    constructor(
        private readonly _formBuilder: NonNullableFormBuilder,
        private readonly _apiService: IApiService,
        private readonly _toastService: HotToastService,
        private readonly _router: Router,
        private readonly _route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this._route.params.subscribe((params) => {
            if (params['token']) {
                this._token = params['token'];
            }
        });
    }

    getErrorMessage(): string {
        const control = this.resetPassForm.get('password');
        if (control.hasError('required')) {
            return `Mot de passe requis`;
        } else if (control.hasError('password')) {
            return 'Mot de passe invalide';
        }
        return '';
    }

    public onResetPassword() {
        this.HasErrors = !this.resetPassForm.valid;
        this.Errors = [];
        if (this.resetPassForm.valid && this._token) {
            this.IsLoading = true;
            const password = this.resetPassForm.value.password!;
            this._apiService
                .callApi('auth/reset-password', 'POST', { token: this._token, password })
                .subscribe({
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
                        this._toastService.success('Votre mot de passe a été changé');
                        this._router.navigate([AppPathEnum.Login]);
                    },
                });
        }
    }
}
