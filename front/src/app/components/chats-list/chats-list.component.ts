import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ConversationModel } from 'src/app/models/conversation.model';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { Message } from '../chat/chat.component';

@Component({
    selector: 'chats-list',
    templateUrl: './chats-list.component.html',
    styleUrls: ['./chats-list.component.scss'],
})
export class ChatsListComponent implements OnInit {
    public Chats: ConversationModel[];
    public CurrentUser: ProfileModel | null;

    @Input() public SelectedChatId: number | null = null;

    @Output() public OnChatSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _socket: Socket,
        private _apiService: IApiService,
        private readonly _authenticationService: IAuthenticationService,
    ) {
        this._apiService
            .callApi<ConversationModel[]>('chat/conversation', 'GET')
            .subscribe((conversations) => (this.Chats = conversations));
    }

    ngOnInit(): void {
        this.subscribeToNewMessages();
        this.init();
    }

    private async init() {
        this.CurrentUser = this._authenticationService.getProfile();
    }

    public getUserName(conversation: ConversationModel): string {
        return this.CurrentUser?.id === conversation.user_1.id
            ? conversation.user_2.name
            : conversation.user_1.name;
    }

    public openChat(chatId: number): void {
        this.SelectedChatId = chatId;
        this.OnChatSelected.emit(chatId);
    }

    private subscribeToNewMessages() {
        this._socket.fromEvent<Message>('NewMessage').subscribe((message) => {
            const conversation = this.Chats.find((chat) => chat.id === message.conv_id);
            if (conversation) {
                conversation.last_message_content = message.content;
                conversation.last_message_created_at = message.created_at;
            }
        });
    }
}
