import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';

@NgModule({
    declarations: [LoginFormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SvgIconComponentModule,
        MatchaButtonModule,
        MatchaInputModule,
    ],
    exports: [LoginFormComponent],
})
export class LoginFormModule {}
