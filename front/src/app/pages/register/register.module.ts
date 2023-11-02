import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormModule } from 'src/app/components/register-form/register-form.module';
import { RegisterComponent } from './register.component';

@NgModule({
    declarations: [RegisterComponent],
    imports: [CommonModule, ReactiveFormsModule, RegisterFormModule],
    exports: [RegisterComponent],
})
export class RegisterModule {}
