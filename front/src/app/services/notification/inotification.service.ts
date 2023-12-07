import { Observable } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';

export abstract class INotificationService {
    public abstract fetchNotifications(): Observable<Notification[]>;
    public abstract deleteMsgNotificationsBySenderId(id: number): void;
    public abstract getNotifications(): Observable<Notification[]>;
    public abstract getMsgNotifications(): Observable<Notification[]>;
}
