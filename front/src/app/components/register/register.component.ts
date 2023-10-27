import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.sevice';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    constructor(
        private _authService: AuthService,
        private _router: Router,
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

    onRegister() {
        if (this.registerForm.valid) {
            this._authService.register(this.registerForm.value).subscribe({
                next: () => {
                    console.log('Register Succes');
                    this._router.navigate(['/login']);
                },
                error: (err) => console.log(err),
            });
        }
    }
}
