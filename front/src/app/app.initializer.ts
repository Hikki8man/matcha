import { catchError, of, tap } from 'rxjs';
import { IAuthenticationService } from './services/authentication/iauthentication.service';
import { ISocketService } from './services/socket/isocket.service';

export function appInitializer(
    authenticationService: IAuthenticationService,
    socketService: ISocketService,
) {
    return () =>
        authenticationService.refreshToken().pipe(
            tap((user) => {
                console.log('refresh');
                socketService.connect(user.access_token);
            }),
            // catch error to start app on success or failure
            catchError(() => of()),
        );
}
