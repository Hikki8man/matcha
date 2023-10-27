import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthService } from './services/auth.sevice';
import { RegisterComponent } from './components/register/register.component';
import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
import { ProfileService } from './services/profile.service';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'complete-profile',
        canActivate: [() => inject(AuthService).authGuard()],
        component: CompleteProfileComponent,
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [
            () => inject(AuthService).authGuard(),
            // () => inject(ProfileService).profileCompleteGuard(),
        ],
        // canActivateChild: [() => inject(ProfileService).profileCompleteGuard()],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'messages',
                component: MessagesComponent,
            },
            {
                path: 'search',
                component: SearchComponent,
            },
            {
                path: 'settings',
                component: SettingsComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'profile',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
