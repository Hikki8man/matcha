import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormModule } from 'src/app/components/login-form/login-form.module';

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, ReactiveFormsModule, LoginFormModule],
    exports: [LoginComponent],
})
export class LoginModule {}
