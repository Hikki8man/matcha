import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Message } from 'src/app/components/chat/chat.component';
import { LikeEvent } from 'src/app/enums/like-type-enum';
import { ConversationModel } from 'src/app/models/conversation.model';
import { Notification } from 'src/app/models/notification.model';
import { ProfileViewModel } from 'src/app/models/profile-view.model';

export abstract class ISocketService {
    public abstract get socket(): Socket;
    public abstract connect(token: string): void;
    public abstract disconnect(): void;
    public abstract sendMessage(msg: string): void;
    public abstract onNewNotification(): Observable<Notification>;
    public abstract onNewMessage(): Observable<Message>;
    public abstract onLastMessageUpdate(): Observable<Message>;
    public abstract onUnmatch(): Observable<ConversationModel>;
    public abstract onMatch(): Observable<ConversationModel>;
    public abstract onLikeEvent(): Observable<LikeEvent>;
    public abstract onProfileView(): Observable<ProfileViewModel>;
}
