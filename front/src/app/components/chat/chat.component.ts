import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
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
export class ChatComponent implements OnInit, OnChanges {

    public Avatar = 'assets/images/detective_squirrel.png';
    public Chat: Conversation;
    public CurrentUser: ProfileModel | null;
    public IsMobileView: boolean = false;

    public IconBackUrl: string = IconUrlEnum.ArrowBack;
    public IconBackStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px' };

    @Input() public ChatId: number | null = null;

    @Output() public BackArrowClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _socket: Socket,
        private _apiService: IApiService,
        private readonly _authenticationService: IAuthenticationService,
    ) { }

    ngOnInit(): void {
        this.listenNewMessageEvent();
        this.init();
        this.IsMobileView = window.innerWidth <= 600;
    }

    private async init() {
        this.CurrentUser = await this._authenticationService.getProfile();
    }
    
    @HostListener('window:resize', ['$event'])
    public handleResize(event: any) {
        this.IsMobileView = event.target.innerWidth <= 600;
    }

    public handleBackArrowClick(): void {
        this.BackArrowClicked.emit();
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


    async ngOnChanges(): Promise<void> {
        console.log('chat id', this.ChatId);
        if (!this.ChatId) return;
        try {
            const conv = await this._apiService.callApi<Conversation>(
                `chat/conversation/${this.ChatId}`,
                'GET',
            );
            this.Chat = conv;
        } catch (err) {
            console.log('error', err);
        }
    }

    public async sendMessage(content: string): Promise<void> {
        const message = {
            conv_id: this.ChatId,
            content,
        };
        try {
            await this._apiService.callApi<Conversation>('chat/message/create', 'POST', message);
        } catch (err) {
            console.log('error', err);
        }
    }
}
