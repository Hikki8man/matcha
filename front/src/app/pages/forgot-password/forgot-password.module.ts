import { NgModule } from '@angular/core';
import { ForgotPasswordFormModule } from 'src/app/components/forgot-password-form/forgot-password-form.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
    declarations: [ForgotPasswordComponent],
    imports: [ForgotPasswordFormModule],
})
export class ForgotPasswordModule {}
