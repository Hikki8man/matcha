import { Component, OnDestroy } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { INotificationService } from 'src/app/services/notification/inotification.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
    public UnreadMessagesCount: number;
    public UnreadNotificationsCount: number;
    public UserIconUrl: string = IconUrlEnum.User;
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartEmptyIconUrl: string = IconUrlEnum.HeartEmpty;
    public MessageIconUrl: string = IconUrlEnum.Message;
    public NotificationsIconUrl: string = IconUrlEnum.Notification;
    public IconStyle: Record<string, string> = { display: 'flex', height: '22px', width: '22px' };

    private _msgSubscription: Subscription;
    private _notifSubscription: Subscription;

    constructor(
        private _notificationService: INotificationService,
        private authService: IAuthenticationService,
    ) {
        this._msgSubscription = this._notificationService
            .getMsgNotifications()
            .pipe(map((filteredNotifications) => filteredNotifications.length))
            .subscribe((count) => (this.UnreadMessagesCount = count));
        this._notifSubscription = this._notificationService
            .getNotifications()
            .pipe(
                map((notifications) => notifications.filter((notif) => !notif.read)),
                map((filteredNotifications) => filteredNotifications.length),
            )
            .subscribe((count) => (this.UnreadNotificationsCount = count));
    }

    ngOnDestroy(): void {
        this._msgSubscription.unsubscribe();
        this._notifSubscription.unsubscribe();
    }

    public logout(): void {
        this.authService.logout();
    }
    public isCurrentPage(page: string): boolean {
        return window.location.href.includes(page);
    }
}
