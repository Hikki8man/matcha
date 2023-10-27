import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { MessagesModule } from './pages/messages/messages.module';
import { ProfileModule } from './pages/profile/profile.module';
import { SearchModule } from './pages/search/search.module';
import { SettingsModule } from './pages/settings/settings.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { RegisterModule } from './components/register/register.module';
import { LoginModule } from './pages/login/login.module';
import { CompleteProfileModule } from './components/complete-profile/complete-profile.module';
import { environment } from 'src/environment/environment';
import { IApiService } from './services/iapi.service';
import { ApiService } from './services/api.service';

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
    providers: [{ provide: IApiService, useClass: ApiService }],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
        console.log('Loading App module');
    }
}
