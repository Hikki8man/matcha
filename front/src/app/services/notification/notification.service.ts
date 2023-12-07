import { Injectable } from '@angular/core';
import { IApiService } from '../api/iapi.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationType } from 'src/app/models/notification.model';
import { INotificationService } from './inotification.service';
import { ISocketService } from '../socket/isocket.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationService implements INotificationService {
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications = this.notificationsSubject.asObservable();

    private msgNotificationsSubject = new BehaviorSubject<Notification[]>([]);
    public msgNotifications = this.msgNotificationsSubject.asObservable();

    constructor(
        private _apiService: IApiService,
        private _socketService: ISocketService,
    ) {
        this.fetchNotifications().subscribe((notifs) => {
            const msgNotifs = notifs.filter((notif) => notif.type === NotificationType.Message);
            this.msgNotificationsSubject.next(msgNotifs);
            const notifications = notifs.filter((notif) => notif.type !== NotificationType.Message);
            this.notificationsSubject.next(notifications);
        });

        this._socketService.onNewNotification().subscribe((notif) => {
            if (notif.type === NotificationType.Message) {
                this.addMessageNotification(notif);
            } else {
                this.addNotification(notif);
            }
        });
    }

    private addMessageNotification(notification: Notification) {
        this.msgNotificationsSubject.next([...this.msgNotificationsSubject.value, notification]);
    }

    private addNotification(notification: Notification) {
        this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
    }

    public getNotifications(): Observable<Notification[]> {
        return this.notifications;
    }

    public getMsgNotifications(): Observable<Notification[]> {
        return this.msgNotifications;
    }

    public markNotificationsAsRead(notifications: Notification[]): void {
        const currentNotifications = this.notificationsSubject.value;
        const isAlreadyRead = currentNotifications.every((notif) => notif.read);
        if (!isAlreadyRead) {
            const updatedNotifications = notifications.map((notif) => {
                return { ...notif, read: true };
            });
            this.notificationsSubject.next(updatedNotifications);
            this._apiService.callApi('notification/read', 'GET').subscribe();
        }
    }

    public deleteMsgNotificationsBySenderId(id: number): void {
        const currentNotifications = this.msgNotificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(
            (notification) => notification.sender.id !== id,
        );
        this.msgNotificationsSubject.next(updatedNotifications);
    }

    public fetchNotifications(): Observable<Notification[]> {
        return this._apiService.callApi<Notification[]>('notification', 'GET');
    }
}
