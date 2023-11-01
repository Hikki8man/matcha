import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ISocketService } from './isocket.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService implements ISocketService {

    constructor(public socket: Socket) {
        console.log('socket in Socket Service');
    }

    public sendMessage(msg: string): void {
        this.socket.emit('msg', msg);
    }
}
