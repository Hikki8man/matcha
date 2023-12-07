import { catchError, of, tap } from 'rxjs';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { ISocketService } from './services/socket/isocket.service';

export function appInitializer(
    authenticationService: IAuthenticationService,
    socketService: ISocketService,
) {
    return () =>
        authenticationService.refreshPage().pipe(
            tap((user) => {
                socketService.connect(user.access_token);
            }),
            catchError(() => of()),
        );
}
