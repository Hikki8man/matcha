import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';

@NgModule({
    declarations: [RegisterFormComponent],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [RegisterFormComponent],
})
export class RegisterFormModule {}
