import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.sevice';

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
        private _authService: AuthService,
        private _httpClient: HttpClient,
    ) {}

    @Input() public ChatId: number | null = null;
    public Avatar = 'assets/images/detective_squirrel.png';
    public Chat: Conversation;

    ngOnInit(): void {
        this.listenNewMessageEvent();
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
        return this._authService.getAuth().profile.id === chat.user_1.id
            ? chat.user_2.name
            : chat.user_1.name;
    }

    isFrom(sender_id: number): boolean {
        return !(this._authService.getAuth().profile.id === sender_id);
    }

    ngOnChanges(): void {
        console.log('chat id', this.ChatId);
        if (!this.ChatId) return;
        this._httpClient
            .get<Conversation>(`http://localhost:8080/chat/conversation/${this.ChatId}`, {
                withCredentials: true,
            })
            .subscribe({
                next: (value) => {
                    this.Chat = value;
                    this.scrollDown();
                },
                error: (err) => {
                    console.log('error', err);
                },
            });
    }

    public sendMessage(content: string): void {
        const message = {
            conv_id: this.ChatId,
            content,
        };
        this._httpClient
            .post('http://localhost:8080/chat/message/create', message, { withCredentials: true })
            .subscribe({
                next: () => {
                    console.log('message sent');
                },
                error: (err) => {
                    console.log('error creating msg ', err);
                },
            });
    }
}
