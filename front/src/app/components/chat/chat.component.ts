import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { INotificationService } from 'src/app/services/notification/inotification.service';
import { ISocketService } from 'src/app/services/socket/isocket.service';

export interface Message {
    content: string;
    sender_id: number;
    conv_id: number;
    created_at: Date;
}

export interface Conversation {
    id: number;
    user_1: { id: number; name: string };
    user_2: { id: number; name: string };
    messages: Message[];
}

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
    constructor(
        private _socketService: ISocketService,
        private _apiService: IApiService,
        private _notificationService: INotificationService,
        private readonly _authenticationService: IAuthenticationService,
    ) {}

    @Input() public ChatId: number | null = null;
    public DefaultAvatar = 'assets/images/detective_squirrel.png';
    public Chat: Conversation | undefined;
    public CurrentUser: ProfileModel | undefined;
    private _interlocutor_id: number;
    private _onNewMessageSubscription: Subscription;
    private _onUnmatchSub: Subscription;

    ngOnInit(): void {
        this.CurrentUser = this._authenticationService.profileValue;
        this._onNewMessageSubscription = this.onNewMessageEvent();
        this._onUnmatchSub = this._socketService.onUnmatch().subscribe((conv) => {
            if (this.Chat && this.Chat.id === conv.id) {
                this.Chat = undefined;
            }
        });
    }

    ngOnDestroy(): void {
        this._onNewMessageSubscription.unsubscribe();
        this._onUnmatchSub.unsubscribe();
        console.log('Chat Component destroy');
    }

    scrollDown() {
        const bodyDiv = document.querySelector('.chat-body');
        // Body div null at first fetch, LOLO fix
        if (bodyDiv) {
            setTimeout(() => {
                bodyDiv.scrollTop = bodyDiv.scrollHeight;
            }, 0);
        }
    }

    onNewMessageEvent(): Subscription {
        return this._socketService.onNewMessage().subscribe((message) => {
            if (this.Chat && this.Chat.id === message.conv_id) {
                this.Chat.messages.push(message);
                this.scrollDown();
            }
        });
    }

    getUserName(chat: Conversation) {
        return this.CurrentUser?.id === chat.user_1.id ? chat.user_2.name : chat.user_1.name;
    }

    isFrom(sender_id: number): boolean {
        return this.CurrentUser?.id !== sender_id;
    }

    ngOnChanges() {
        if (!this.ChatId) return;
        this._apiService
            .callApi<Conversation>(`chat/conversation/${this.ChatId}`, 'GET')
            .subscribe((conv) => {
                this.Chat = conv;
                this._interlocutor_id =
                    this.Chat.user_1.id === this.CurrentUser?.id
                        ? this.Chat.user_2.id
                        : this.Chat.user_1.id;
                this._notificationService.deleteNotificationsBySenderId(this._interlocutor_id);
            });
    }

    public sendMessage(content: string): void {
        const message = {
            receiver_id: this._interlocutor_id,
            content,
        };
        this._apiService.callApi<Conversation>('chat/message/create', 'POST', message).subscribe();
    }
}
