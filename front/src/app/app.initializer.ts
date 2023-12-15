import { catchError, of } from 'rxjs';
import { IAuthenticationService } from './services/authentication/iauthentication.service';

export function appInitializer(authenticationService: IAuthenticationService) {
    return () => authenticationService.refreshPage().pipe(catchError(() => of()));
}
