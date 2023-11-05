import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CompleteProfileComponent } from './components/complete-profile/complete-profile.component';
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
import { mergeMap } from 'rxjs';

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
        path: 'complete-profile',
        canActivate: [() => inject(IAuthenticationService).isAuthenticatedGuard()],
        // component: CompleteProfileComponent,
        //TODO add profile not complete guard
        children: [
            {
                path: 'name',
                component: CompleteProfileNameComponent,
            },
            {
                path: 'gender',
                component: CompleteProfileGenderComponent,
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
                const authService = inject(IAuthenticationService);
                const completedService = inject(ICompleteProfileService);
                const guard$ = authService
                    .isAuthenticatedGuard()
                    .pipe(mergeMap((profile) => completedService.isProfileCompleteGuard(profile)));

                return guard$;
            },
        ],
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
