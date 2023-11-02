import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environment/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompleteProfileModule } from './components/complete-profile/complete-profile.module';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { LoginModule } from './pages/login/login.module';
import { MessagesModule } from './pages/messages/messages.module';
import { ProfileModule } from './pages/profile/profile.module';
import { SearchModule } from './pages/search/search.module';
import { SettingsModule } from './pages/settings/settings.module';
import { ApiService } from './services/api/api.service';
import { IApiService } from './services/api/iapi.service';
import { AuthenticationService } from './services/authentication/authentication.sevice';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { IProfileService } from './services/profile/iprofile.service';
import { ProfileService } from './services/profile/profile.service';
import { RegisterModule } from './pages/register/register.module';

const config: SocketIoConfig = {
    url: environment.apiBaseUrl,
    options: { withCredentials: true, autoConnect: false },
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        SocketIoModule.forRoot(config),
        BrowserModule,
        AppRoutingModule,
        MainLayoutModule,
        ProfileModule,
        MessagesModule,
        BrowserModule,
        SettingsModule,
        SearchModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LoginModule,
        RegisterModule,
        CompleteProfileModule,
    ],
    providers: [
        { provide: IApiService, useClass: ApiService },
        { provide: IAuthenticationService, useClass: AuthenticationService },
        { provide: IProfileService, useClass: ProfileService }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        console.log('Loading App module');
    }
}
