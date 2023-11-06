import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

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
        private _socket: Socket,
        private _apiService: IApiService,
        private readonly _authenticationService: IAuthenticationService,
    ) {}

    @Input() public ChatId: number | null = null;
    public Avatar = 'assets/images/detective_squirrel.png';
    public Chat: Conversation;
    public CurrentUser: ProfileModel | null;

    ngOnInit(): void {
        this.listenNewMessageEvent();
        this.init();
    }

    private async init() {
        this.CurrentUser = await this._authenticationService.getProfile();
    }

    ngOnDestroy(): void {
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

    listenNewMessageEvent() {
        this._socket.fromEvent<Message>('NewMessage').subscribe((message) => {
            console.log('message received, Chat defined: ', this.Chat ? true : false);
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
        console.log('chat id', this.ChatId);
        if (!this.ChatId) return;
        this._apiService
            .callApi<Conversation>(`chat/conversation/${this.ChatId}`, 'GET')
            .subscribe((conv) => (this.Chat = conv));
    }

    public async sendMessage(content: string): Promise<void> {
        const message = {
            conv_id: this.ChatId,
            content,
        };

        this._apiService.callApi<Conversation>('chat/message/create', 'POST', message).subscribe();
    }
}
