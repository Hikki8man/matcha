import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPathEnum } from './enums/app-path-enum';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserComponent } from './pages/user/user.component';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { ICompleteProfileService } from './services/complete-profile/icomplete-profile.service';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { VerifyAccountComponent } from './components/verify-account/verify-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const notAuthenticatedGuard = () => inject(IAuthenticationService).isNotAuthenticatedGuard();
const isAuthenticatedGuard = () => inject(IAuthenticationService).isAuthenticatedGuard();
const isProfileNotCompleteGuard = () => inject(ICompleteProfileService).isProfileNotCompleteGuard();
const isProfileCompleteGuard = () => inject(ICompleteProfileService).isProfileCompleteGuard();

const routes: Routes = [
    {
        path: 'complete-profile',
        canActivate: [isAuthenticatedGuard, isProfileNotCompleteGuard],
        component: CompleteProfileComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [isAuthenticatedGuard, isProfileCompleteGuard],
        children: [
            {
                path: `${AppPathEnum.Profile}/me`,
                component: ProfileComponent,
            },
            {
                path: `${AppPathEnum.Profile}/:id`,
                component: UserComponent,
            },
            {
                path: AppPathEnum.Messages,
                component: MessagesComponent,
            },
            {
                path: AppPathEnum.Search,
                component: SearchComponent,
            },
            {
                path: AppPathEnum.Settings,
                component: SettingsComponent,
            },
            {
                path: AppPathEnum.Notifications,
                component: NotificationsComponent,
            },
        ],
    },
    {
        path: '',
        canActivate: [notAuthenticatedGuard],
        children: [
            {
                path: AppPathEnum.VerifyAccount,
                component: VerifyAccountComponent,
            },
            {
                path: AppPathEnum.Login,
                component: LoginComponent,
            },
            {
                path: AppPathEnum.Register,
                component: RegisterComponent,
            },
            {
                path: AppPathEnum.ForgotPassword,
                component: ForgotPasswordComponent,
            },
            {
                path: AppPathEnum.ResetPassword,
                component: ResetPasswordComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: AppPathEnum.Register, // TODO 404 page
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
