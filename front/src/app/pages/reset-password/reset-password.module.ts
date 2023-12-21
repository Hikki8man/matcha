import { NgModule } from '@angular/core';
import { ResetPasswordFormModule } from 'src/app/components/reset-password-form/reset-password-form.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
    declarations: [ResetPasswordComponent],
    imports: [ResetPasswordFormModule],
})
export class ResetPasswordModule {}
