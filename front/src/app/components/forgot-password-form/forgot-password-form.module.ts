import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [ForgotPasswordFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SvgIconComponentModule,
        MatchaButtonModule,
        MatchaInputModule,
        RouterModule,
    ],
    exports: [ForgotPasswordFormComponent],
})
export class ForgotPasswordFormModule {}
