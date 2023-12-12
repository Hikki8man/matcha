import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
    selector: 'register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {

    public HasErrors: boolean = false;
    public IsLoading: boolean = false;
    public Errors: string[] = [];

    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
        width: '14px',
    };

    constructor(
        private readonly _authService: IAuthenticationService,
        private readonly _router: Router,
        private readonly _formBuilder: FormBuilder,
    ) { }

    public registerForm: FormGroup = this._formBuilder.group({
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        birth_date: ['', []],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    getErrorMessage(controlName: string): string {
        const control = this.registerForm.get(controlName);
        if (control?.hasError('required')) {
            return `${controlName} is required`;
        } else if (control?.hasError('email')) {
            return 'Invalid email address';
        }
        return '';
    }

    onRegister() {
        this.HasErrors = !this.registerForm.valid;
        if (this.registerForm.valid) {
            this.IsLoading = true;
            this._authService.register(this.registerForm.value).subscribe({
                error: (err) => {
                    this.Errors = err.error.map((x: any) => x.msg);
                    console.log('errors', this.Errors);
                    
                    this.IsLoading = false;
                },
                complete: () => {
                    this._router.navigate([AppPathEnum.Login]);
                    this.IsLoading = false;
                },
            });
        }
    }
}
