import { Observable } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';

export abstract class INotificationService {
    public abstract fetchNotifications(): Observable<Notification[]>;
    public abstract deleteNotificationsBySenderId(id: number): void;
    public abstract getNotifications(): Observable<Notification[]>;
}
