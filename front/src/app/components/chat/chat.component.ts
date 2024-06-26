import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { INotificationService } from 'src/app/services/notification/inotification.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISocketService } from 'src/app/services/socket/isocket.service';

export interface Message {
    content: string;
    sender_id: number;
    conv_id: number;
    created_at: Date;
}

export interface Conversation {
    id: number;
    user_1: { id: number; name: string; avatar: string };
    user_2: { id: number; name: string; avatar: string };
    messages: Message[];
}

@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
    constructor(
        private readonly _socketService: ISocketService,
        private readonly _apiService: IApiService,
        private readonly _notificationService: INotificationService,
        private readonly _authenticationService: IAuthenticationService,
        private readonly _router: Router,
        private readonly _profileService: IProfileService,
    ) {}

    @Input() public ChatId: number | null = null;
    @Output() public BackArrowClicked: EventEmitter<void> = new EventEmitter<void>();

    public IconBackUrl = IconUrlEnum.ArrowBack;
    public IconBackStyle: Record<string, string> = {
        display: 'flex',
        height: '20px',
        width: '20px',
    };

    public IsMobileView: boolean = false;
    public Avatar = 'assets/images/detective_squirrel.png';
    public Chat: Conversation | undefined;
    public CurrentUser: ProfileModel | undefined;
    public InterlocutorId: number;
    private _onNewMessageSubscription: Subscription;
    private _onUnmatchSub: Subscription;

    ngOnInit(): void {
        this.CurrentUser = this._authenticationService.profileValue;
        this.IsMobileView = window.innerWidth <= 600;
        this._onNewMessageSubscription = this.onNewMessageEvent();
        this._onUnmatchSub = this._socketService.onUnmatch().subscribe((conv) => {
            if (this.Chat && this.Chat.id === conv.id) {
                this._socketService.socket.emit('LeaveConversation', this.Chat.id);
                this.Chat = undefined;
            }
        });
    }

    public redirectToUserProfile() {
        this._router.navigate([`/${AppPathEnum.Profile}/${this.InterlocutorId}`]);
    }

    ngOnDestroy(): void {
        this._onNewMessageSubscription.unsubscribe();
        this._onUnmatchSub.unsubscribe();
        if (this.Chat) {
            this._socketService.socket.emit('LeaveConversation', this.Chat.id);
        }
        console.log('Chat Component destroy');
    }

    public handleBackArrowClick(): void {
        this.BackArrowClicked.emit();
    }

    @HostListener('window:resize', ['$event'])
    public handleResize(event: any) {
        this.IsMobileView = event.target.innerWidth <= 600;
    }

    scrollDown() {
        const bodyDiv = document.querySelector('.chat-body');
        if (bodyDiv) {
            setTimeout(() => {
                bodyDiv.scrollTop = bodyDiv.scrollHeight;
            }, 10);
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
        if (this.Chat) {
            this._socketService.socket.emit('LeaveConversation', this.Chat.id);
        }
        this._apiService
            .callApi<Conversation>(`chat/conversation/${this.ChatId}`, 'GET')
            .subscribe((conv) => {
                this.Chat = conv;
                const interlocutor =
                    this.Chat.user_1.id === this.CurrentUser?.id
                        ? this.Chat.user_2
                        : this.Chat.user_1;
                this.InterlocutorId = interlocutor.id;
                this.Avatar = this._profileService.getAvatar(interlocutor.avatar);
                this._notificationService.deleteMsgNotificationsBySenderId(this.InterlocutorId);
                setTimeout(() => {
                    this.scrollDown();
                }, 10);
            });
        this._socketService.socket.emit('JoinConversation', this.ChatId);
    }

    public sendMessage(content: string): void {
        const message = {
            receiver_id: this.InterlocutorId,
            content,
        };
        this._apiService.callApi<Conversation>('chat/message/create', 'POST', message).subscribe();
    }
}
