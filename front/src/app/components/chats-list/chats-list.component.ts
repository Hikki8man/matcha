import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.sevice';
import { IApiService } from 'src/app/services/iapi.service';
import { Message } from '../chat/chat.component';

interface ConversationList {
    id: number;
    user_1: { id: number; name: string };
    user_2: { id: number; name: string };
    last_message_content: string;
    last_message_created_at: Date;
}

@Component({
    selector: 'chats-list',
    templateUrl: './chats-list.component.html',
    styleUrls: ['./chats-list.component.scss'],
})
export class ChatsListComponent implements OnInit {
    public Chats: ConversationList[];

    constructor(
        private _authService: AuthService,
        private _socket: Socket,
        private _apiService: IApiService,
    ) {
        this._apiService
            .callApi<ConversationList[]>('chat/conversation', 'GET')
            .then((data) => (this.Chats = data))
            .catch((err) => console.log(err));
    }

    ngOnInit(): void {
        this.listenNewMessageEvent();
    }

    // lastMessageDate(date: Date) {
    //     const current_date = new Date();
    //     const message_date = new Date(date);
    //     const month = current_date.getMonth() - message_date.getMonth();
    //     const time = message_date.g;
    //     console.log('month', month);
    //     console.log('time', time);
    //     return new Date(date);
    // }

    listenNewMessageEvent() {
        this._socket.fromEvent<Message>('NewMessage').subscribe((message) => {
            const conversation = this.Chats.find((chat) => chat.id === message.conv_id);
            if (conversation) {
                conversation.last_message_content = message.content;
                conversation.last_message_created_at = message.created_at;
            }
        });
    }

    getUserName(conv: ConversationList) {
        return this._authService.getAuth().profile.id === conv.user_1.id
            ? conv.user_2.name
            : conv.user_1.name;
    }

    @Input() public SelectedChatId: number | null = null;

    @Output() public OnChatSelected: EventEmitter<number> = new EventEmitter<number>();

    public openChat(chatId: number): void {
        this.SelectedChatId = chatId;
        this.OnChatSelected.emit(chatId);
    }
}
