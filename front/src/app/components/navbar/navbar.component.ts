import { Component, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { NotificationType } from 'src/app/models/notification.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { INotificationService } from 'src/app/services/notification/inotification.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
    private _msgSubscription: Subscription;
    public notificationsCount: number;
    public UserIconUrl: string = IconUrlEnum.User;
    public UsersIconUrl: string = IconUrlEnum.Users;
    public MessageIconUrl: string = IconUrlEnum.Message;
    public SettingsIconUrl: string = IconUrlEnum.Settings;
    public LogoutIconUrl: string = IconUrlEnum.Logout;
    public IconStyle: Record<string, string> = { display: 'flex', height: '22px', width: '22px' };
  
    constructor(
        private _notificationService: INotificationService,
        private authService: IAuthenticationService,
    ) {
        this._msgSubscription = this._notificationService
            .getNotifications()
            .pipe(
                map((notifications) =>
                    notifications.filter((notif) => notif.type === NotificationType.Message),
                ),
                map((filteredNotifications) => filteredNotifications.length),
            )
            .subscribe((count) => (this.notificationsCount = count));
    }

    ngOnDestroy(): void {
        this._msgSubscription.unsubscribe();
    }

    public logout(): void {
        this.authService.logout();
    }
    public isCurrentPage(page: string): boolean {
        return window.location.href.includes(page);
    }
}
