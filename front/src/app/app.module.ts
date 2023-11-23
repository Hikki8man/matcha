import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { ICompleteProfileService } from './services/complete-profile/icomplete-profile.service';
import { CompleteProfileService } from './services/complete-profile/complete-profile.service';
import { INotificationService } from './services/notification/inotification.service';
import { NotificationService } from './services/notification/notification.service';
import { JwtInterceptor } from './services/api/jwt.interceptor';
import { appInitializer } from './app.initializer';
import { ErrorInterceptor } from './services/api/error.interceptor';
import { SocketService } from './services/socket/socket.service';
import { ISocketService } from './services/socket/isocket.service';
import { SearchFilterService } from './services/search-filter/search-filter.service';
import { ISearchFilterService } from './services/search-filter/isearch-filter.service';

const config: SocketIoConfig = {
    url: '',
    options: { autoConnect: false },
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
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [IAuthenticationService, ISocketService],
        },
        { provide: IApiService, useClass: ApiService },
        { provide: ISocketService, useClass: SocketService },
        { provide: IAuthenticationService, useClass: AuthenticationService },
        { provide: IProfileService, useClass: ProfileService },
        { provide: ICompleteProfileService, useClass: CompleteProfileService },
        { provide: INotificationService, useClass: NotificationService },
        { provide: ISearchFilterService, useClass: SearchFilterService },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        console.log('Loading App module');
    }
}
