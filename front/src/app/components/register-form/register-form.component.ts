import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
    selector: 'register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
    constructor(
        private _authService: IAuthenticationService,
    ) {}
    registerForm = new FormGroup({
        username: new FormControl('', { validators: [Validators.required] }),
        firstname: new FormControl('', { validators: [Validators.required] }),
        lastname: new FormControl('', { validators: [Validators.required] }),
        birth_date: new FormControl(),
        email: new FormControl('', { validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { validators: [Validators.required] }),
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

    async onRegister() {
        if (this.registerForm.valid) {
            try {
                const res = await this._authService.register(this.registerForm.value);
                console.log(res);
            } catch (err: any) {
                console.log('yes errors', err.error.errors);
            }
        }
    }
}
