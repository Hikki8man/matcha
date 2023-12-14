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

const routes: Routes = [
    {
        path: '',
        redirectTo: `${AppPathEnum.Profile}/me`,
        pathMatch: 'full',
    },
    {
        path: AppPathEnum.Login,
        component: LoginComponent,
        canActivate: [() => inject(IAuthenticationService).isNotAuthenticatedGuard()],
    },
    {
        path: AppPathEnum.Register,
        component: RegisterComponent,
        canActivate: [() => inject(IAuthenticationService).isNotAuthenticatedGuard()],
    },
    {
        path: 'complete-profile',
        canActivate: [
            () => {
                inject(IAuthenticationService).isAuthenticatedGuard();
                inject(ICompleteProfileService).isProfileNotCompleteGuard();
            },
        ],
        component: CompleteProfileComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [
            () => {
                inject(IAuthenticationService).isAuthenticatedGuard();
                inject(ICompleteProfileService).isProfileCompleteGuard();
            },
        ],
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
        path: '**',
        redirectTo: `${AppPathEnum.Profile}/me`,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
