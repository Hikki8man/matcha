import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ConversationModel } from 'src/app/models/conversation.model';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { Message } from '../chat/chat.component';
import { Subscription, map } from 'rxjs';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'chats-list',
    templateUrl: './chats-list.component.html',
    styleUrls: ['./chats-list.component.scss'],
})
export class ChatsListComponent implements OnInit, OnDestroy {
    public Chats: ConversationModel[];
    public CurrentUser: ProfileModel;
    public defaultAvatar = 'assets/images/detective_squirrel.png';
    private _onNewMessageSub: Subscription;

    @Input() public SelectedChatId: number | null = null;

    @Output() public OnChatSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _socket: Socket,
        private _apiService: IApiService,
        private readonly _authenticationService: IAuthenticationService,
        private _profileService: IProfileService,
    ) {
        this.CurrentUser = this._authenticationService.getProfile();
        this._apiService
            .callApi<ConversationModel[]>('chat/conversation', 'GET')
            .pipe(
                map((conversations) => {
                    return conversations.map((conversation) => {
                        const interlocutor_id =
                            conversation.user_1.id === this.CurrentUser.id
                                ? conversation.user_2.id
                                : conversation.user_1.id;
                        return {
                            ...conversation,
                            avatar: this._profileService.getAvatar(interlocutor_id),
                        };
                    });
                }),
            )
            .subscribe((conversations) => (this.Chats = conversations));
    }

    ngOnInit(): void {
        console.log('chat list component init');
        this._onNewMessageSub = this.subscribeToNewMessages();
        this._socket.emit('JoinConversations');
    }

    ngOnDestroy(): void {
        console.log('chat list component destroy');
        this._socket.emit('LeaveConversations');
        this._onNewMessageSub.unsubscribe();
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
        return this._socket.fromEvent<Message>('NewMessage').subscribe((message) => {
            const conversation = this.Chats.find((chat) => chat.id === message.conv_id);
            console.log('chat = ', conversation);
            if (conversation) {
                conversation.last_message_content = message.content;
                conversation.last_message_created_at = message.created_at;
            }
        });
    }
}
