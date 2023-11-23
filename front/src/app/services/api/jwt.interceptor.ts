import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthenticationService } from '../authentication/iauthentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: IAuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authenticationService.userValue;
        const access_token = user?.access_token;
        if (access_token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${access_token}` },
            });
        }

        return next.handle(request);
    }
}
