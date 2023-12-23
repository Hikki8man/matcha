import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordFormComponent } from './reset-password-form.component';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';

@NgModule({
    declarations: [ResetPasswordFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SvgIconComponentModule,
        MatchaButtonModule,
        MatchaInputModule,
    ],
    exports: [ResetPasswordFormComponent],
})
export class ResetPasswordFormModule {}
