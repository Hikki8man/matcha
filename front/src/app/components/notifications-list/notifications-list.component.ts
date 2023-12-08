import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';
import { INotificationService } from 'src/app/services/notification/inotification.service';

@Component({
    selector: 'notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent implements OnDestroy {
    public Notifications: Notification[] = [];
    private _destroyed$: Subject<boolean> = new Subject();

    constructor(private _notificationService: INotificationService) {
        // this._notificationService.readNotifications();
        this._notificationService
            .getNotifications()
            .pipe(
                takeUntil(this._destroyed$),
                tap((notifs) => {
                    this._notificationService.markNotificationsAsRead(notifs);
                }),
            )
            .subscribe((notifs) => (this.Notifications = notifs));
    }

    ngOnDestroy(): void {
        this._destroyed$.next(true);
        this._destroyed$.complete();
    }
}
