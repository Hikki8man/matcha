import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { ISocketService } from './isocket.service';
import { environment } from 'src/environment/environment';
import { Message } from 'src/app/components/chat/chat.component';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/models/notification.model';

@Injectable({
    providedIn: 'root',
})
export class SocketService implements ISocketService {
    private _socket: Socket;

    constructor() {
        console.log('socket in Socket Service');
        const config: SocketIoConfig = {
            url: environment.apiBaseUrl,
            options: { autoConnect: false },
        };
        this._socket = new Socket(config);
    }

    public get socket(): Socket {
        return this._socket;
    }

    public connect(token: string): void {
        const config: SocketIoConfig = {
            url: environment.apiBaseUrl,
            options: { extraHeaders: { authorization: `Bearer ${token}` } },
        };
        this._socket = new Socket(config);
    }

    public onNewMessage(): Observable<Message> {
        return this._socket.fromEvent<Message>('NewMessage');
    }

    public onNewNotification(): Observable<Notification> {
        return this._socket.fromEvent<Notification>('NewNotification');
    }

    public sendMessage(msg: string): void {
        this.socket.emit('msg', msg);
    }
}
