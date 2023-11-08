import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Message } from 'src/app/components/chat/chat.component';
import { Notification } from 'src/app/models/notification.model';

export abstract class ISocketService {
    public abstract get socket(): Socket;
    public abstract connect(token: string): void;
    public abstract sendMessage(msg: string): void;
    public abstract onNewNotification(): Observable<Notification>;
    public abstract onNewMessage(): Observable<Message>;
}
