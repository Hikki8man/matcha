import { catchError, of } from 'rxjs';
import { IAuthenticationService } from './services/authentication/iauthentication.service';

export function appInitializer(authenticationService: IAuthenticationService) {
    return () =>
        authenticationService.refreshToken().pipe(
            // catch error to start app on success or failure
            catchError(() => of()),
        );
}
