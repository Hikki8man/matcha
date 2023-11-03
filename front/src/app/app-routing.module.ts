import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { AppPathEnum } from './enums/app-path-enum';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { RegisterComponent } from './pages/register/register.component';
// import { IProfileService } from './services/profile/iprofile.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: AppPathEnum.Profile,
        pathMatch: 'full',
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
        path: AppPathEnum.CompleteProfile,
        canActivate: [() => inject(IAuthenticationService).isAuthenticatedGuard()],
        component: CompleteProfileComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [
            () => inject(IAuthenticationService).isAuthenticatedGuard(),
            // () => inject(IProfileService).isProfileCompleteGuard(),
        ],
        // canActivateChild: [() => inject(IProfileService).isProfileCompleteGuard()],
        children: [
            {
                path: AppPathEnum.Profile,
                component: ProfileComponent,
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
        ],
    },
    {
        path: '**',
        redirectTo: AppPathEnum.Profile,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
