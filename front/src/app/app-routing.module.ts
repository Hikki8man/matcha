import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPathEnum } from './enums/app-path-enum';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { RegisterComponent } from './pages/register/register.component';
import { CompleteProfileNameComponent } from './components/complete-profile/complete-profile-name.component';
import { CompleteProfileGenderComponent } from './components/complete-profile/complete-profile-gender.component';
import { CompleteProfileAvatarComponent } from './components/complete-profile/complete-profile-avatar.component';
import { CompleteProfileBioComponent } from './components/complete-profile/complete-profile-bio.component';
import { CompleteProfileTagsComponent } from './components/complete-profile/complete-profile-tags.component';
import { ICompleteProfileService } from './services/complete-profile/icomplete-profile.service';
import { CompleteProfileLocationComponent } from './components/complete-profile/complete-profile-location';
import { CompleteProfileSexualOrientationComponent } from './components/complete-profile/complete-profile-orientation.component';
import { UserComponent } from './pages/user/user.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: `${AppPathEnum.Profile}/me`,
        pathMatch: 'full',
    },
    {
        path: 'location',
        component: CompleteProfileLocationComponent,
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
        children: [
            {
                pathMatch: 'full',
                path: '',
                redirectTo: '/search',
            },
            {
                path: 'name',
                component: CompleteProfileNameComponent,
            },
            {
                path: 'gender',
                component: CompleteProfileGenderComponent,
            },
            {
                path: 'sexual-orientation',
                component: CompleteProfileSexualOrientationComponent,
            },
            {
                path: 'avatar',
                component: CompleteProfileAvatarComponent,
            },
            {
                path: 'bio',
                component: CompleteProfileBioComponent,
            },
            {
                path: 'tags',
                component: CompleteProfileTagsComponent,
            },
        ],
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
export class AppRoutingModule {}
