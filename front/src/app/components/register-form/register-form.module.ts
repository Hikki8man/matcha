import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RegisterFormComponent } from './register-form.component';

@NgModule({
    declarations: [RegisterFormComponent],
    imports: [CommonModule, ReactiveFormsModule, SvgIconComponentModule, MatchaInputModule],
    exports: [RegisterFormComponent],
})
export class RegisterFormModule {}
