import { Injectable } from '@angular/core';
import { IApiService } from '../api/iapi.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';
import { INotificationService } from './inotification.service';
import { ISocketService } from '../socket/isocket.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService implements INotificationService {
    private notificationsSubject: BehaviorSubject<Notification[]>;
    public notifications: Observable<Notification[]>;

    constructor(
        private _apiService: IApiService,
        private _socketService: ISocketService,
    ) {
        this.notificationsSubject = new BehaviorSubject<Notification[]>([]);
        this.notifications = this.notificationsSubject.asObservable();

        this.fetchNotifications().subscribe((notifs) => {
            this.notificationsSubject.next(notifs);
        });

        this._socketService
            .onNewNotification()
            .subscribe((notif) => this.addMessageNotification(notif));
    }

    private addMessageNotification(notification: Notification) {
        this.notificationsSubject.next([...this.notificationsSubject.value, notification]);
    }

    public getNotifications(): Observable<Notification[]> {
        return this.notifications;
    }

    public deleteNotificationsBySenderId(id: number): void {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(
            (notification) => notification.sender_id !== id,
        );
        this.notificationsSubject.next(updatedNotifications);
    }

    public fetchNotifications(): Observable<Notification[]> {
        return this._apiService.callApi<Notification[]>('notification', 'GET');
    }
}
