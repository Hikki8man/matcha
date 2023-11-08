import http from 'http';
import { Server, Socket } from 'socket.io';
import { env } from './config';
import { JwtPayload } from 'jsonwebtoken';
import authService from './Auth/Auth.service';
import db from './Database/connection';
import { Conversation } from './Types/Chat';
import { MyJwtPayload } from './Types/JwtPayload';
import { AuthenticatedSocket } from './Types/AuthenticatedSocket';

class SocketService {
  private static server: Server;

  constructor(server: http.Server) {
    console.log('Socket constructor');
    SocketService.server = new Server(server, {
      cors: { origin: env.FRONT_URL, credentials: true },
    });
  }

  private validToken(cookie: string | undefined): MyJwtPayload | undefined {
    if (!cookie) {
      return undefined;
    }
    let payload: MyJwtPayload | undefined;
    const tokenPairs = cookie.split('; ');
    tokenPairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key === 'refresh_token') {
        payload = authService.verifyToken(value);
      }
    });
    return payload;
  }

  private onJoinConversations(
    socket: AuthenticatedSocket,
    chatJoined: boolean,
  ) {
    socket.on('JoinConversations', () => {
      db<Conversation>('conversation')
        .select('id')
        .where('user_1', socket.user_id)
        .orWhere('user_2', socket.user_id)
        .then((data) => {
          data.forEach((conv) => {
            console.log('join conversation ' + conv.id);
            socket.join(`conversation-${conv.id}`);
          });
        });
      chatJoined = true;
    });
  }

  private onLeaveConversations(
    socket: AuthenticatedSocket,
    chatJoined: boolean,
  ) {
    socket.on('LeaveConversations', () => {
      db<Conversation>('conversation')
        .select('id')
        .where('user_1', socket.user_id)
        .orWhere('user_2', socket.user_id)
        .then((data) => {
          data.forEach((conv) => {
            console.log('join conversation ' + conv.id);
            socket.leave(`conversation-${conv.id}`);
          });
        });
      chatJoined = false;
    });
  }

  private onDisconnect(socket: AuthenticatedSocket) {
    socket.on('disconnect', () => {
      console.log('user ' + socket.user_id + ' disconnected');
    });
  }

  public listen() {
    SocketService.server.on('connection', (socket: AuthenticatedSocket) => {
      socket.user_id = this.validToken(socket.handshake.headers.cookie)?.id;
      console.log('hi', socket.user_id);
      this.onDisconnect(socket);
      if (socket.user_id === undefined) {
        return socket.disconnect();
      }
      let chatJoined: boolean = false;
      socket.join(`user-${socket.user_id}`);
      this.onJoinConversations(socket, chatJoined);
      this.onLeaveConversations(socket, chatJoined);
    });
  }

  public static get getServer(): Server {
    return SocketService.server;
  }
}

export default SocketService;
