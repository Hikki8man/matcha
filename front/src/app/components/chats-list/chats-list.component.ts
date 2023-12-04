import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ConversationModel } from 'src/app/models/conversation.model';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISocketService } from 'src/app/services/socket/isocket.service';
import { timeAgo } from 'src/app/utils/timeAgo';

@Component({
    selector: 'chats-list',
    templateUrl: './chats-list.component.html',
    styleUrls: ['./chats-list.component.scss'],
})
export class ChatsListComponent implements OnInit, OnDestroy {
    public Chats: ConversationModel[];
    public CurrentUser: ProfileModel;
    public defaultAvatar = 'assets/images/detective_squirrel.png';
    private _destroyed$: Subject<boolean> = new Subject();

    @Input() public SelectedChatId: number | null = null;

    @Output() public OnChatSelected: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _apiService: IApiService,
        private _socketService: ISocketService,
        private _profileService: IProfileService,
    ) {
        this.CurrentUser = inject(IAuthenticationService).profileValue!;
        this._apiService
            .callApi<ConversationModel[]>('chat/conversation', 'GET')
            .pipe(
                map((conversations) => {
                    return conversations.map((conversation) => {
                        const interlocutor =
                            conversation.user_1.id === this.CurrentUser.id
                                ? conversation.user_2
                                : conversation.user_1;
                        const last_msg = conversation.last_message_created_at;
                        return {
                            ...conversation,
                            send_at: last_msg ? timeAgo(last_msg) : undefined,
                            avatar: this._profileService.getAvatar(interlocutor.avatar),
                        };
                    });
                }),
            )
            .subscribe((conversations) => (this.Chats = conversations));
    }

    ngOnInit(): void {
        console.log('chat list component init');
        this._socketService
            .onUnmatch()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((conv) => {
                this.Chats = this.Chats.filter((chat) => chat.id !== conv.id);
            });
        this._socketService
            .onMatch()
            .pipe(
                takeUntil(this._destroyed$),
                map((conv) => {
                    const interlocutor =
                        conv.user_1.id === this.CurrentUser.id ? conv.user_2 : conv.user_1;
                    return {
                        ...conv,
                        avatar: this._profileService.getAvatar(interlocutor.avatar),
                    };
                }),
            )
            .subscribe((conv) => {
                this.Chats.push(conv);
            });
        this.subscribeToLastMessageUpdate();
    }

    ngOnDestroy(): void {
        console.log('chat list component destroy');
        this._destroyed$.next(true);
        this._destroyed$.complete();
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

    private subscribeToLastMessageUpdate() {
        return this._socketService
            .onLastMessageUpdate()
            .pipe(takeUntil(this._destroyed$))
            .subscribe((msg) => {
                const conversation = this.Chats.find((chat) => chat.id === msg.conv_id);
                if (conversation) {
                    conversation.last_message_content = msg.content;
                    conversation.last_message_created_at = msg.created_at;
                    conversation.send_at = timeAgo(msg.created_at);
                }
            });
    }
}
