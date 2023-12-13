import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RegisterFormComponent } from './register-form.component';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [RegisterFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SvgIconComponentModule,
        MatchaInputModule,
        MatchaButtonModule,
        RouterModule,
    ],
    exports: [RegisterFormComponent],
})
export class RegisterFormModule { }
