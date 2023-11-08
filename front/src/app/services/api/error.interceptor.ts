import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAuthenticationService } from '../authentication/iauthentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private _authService: IAuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this._authService.userValue;
        const access_token = user?.access_token;

        if (access_token) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${access_token}` },
            });
        }

        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    this._authService.logout();
                }
                return throwError(() => error);
            }),
        );
    }
}
