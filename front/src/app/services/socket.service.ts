import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    constructor(public socket: Socket) {
        console.log('socket in Socket Service');
    }
    // getMessage() {
    //     return this.socket.fromEvent<any>('msg').map((data) => data.msg);
    // }

    sendMessage(msg: string) {
        this.socket.emit('msg', msg);
    }
}
