import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appInitializer } from './app.initializer';
import { CompleteProfileModule } from './components/complete-profile/complete-profile.module';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { LoginModule } from './pages/login/login.module';
import { MessagesModule } from './pages/messages/messages.module';
import { ProfileModule } from './pages/profile/profile.module';
import { RegisterModule } from './pages/register/register.module';
import { SearchModule } from './pages/search/search.module';
import { SettingsModule } from './pages/settings/settings.module';
import { ApiService } from './services/api/api.service';
import { ErrorInterceptor } from './services/api/error.interceptor';
import { IApiService } from './services/api/iapi.service';
import { JwtInterceptor } from './services/api/jwt.interceptor';
import { AuthenticationService } from './services/authentication/authentication.sevice';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { CompleteProfileService } from './services/complete-profile/complete-profile.service';
import { ICompleteProfileService } from './services/complete-profile/icomplete-profile.service';
import { INotificationService } from './services/notification/inotification.service';
import { NotificationService } from './services/notification/notification.service';
import { IProfileService } from './services/profile/iprofile.service';
import { ProfileService } from './services/profile/profile.service';
import { ISearchFilterService } from './services/search-filter/isearch-filter.service';
import { SearchFilterService } from './services/search-filter/search-filter.service';
import { ISocketService } from './services/socket/isocket.service';
import { SocketService } from './services/socket/socket.service';
import { UserModule } from './pages/user/user.module';
import { NotificationsModule } from './pages/notifications/notifications.module';
import { ILocationService } from './services/location/ilocation.service';
import { LocationService } from './services/location/location.service';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './pages/reset-password/reset-password.module';

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
        UserModule,
        NotificationsModule,
        CompleteProfileModule,
        ForgotPasswordModule,
        ResetPasswordModule,
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
        { provide: ILocationService, useClass: LocationService },

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
