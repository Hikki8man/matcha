import http from 'http';
import { Server, Socket } from 'socket.io';
import { env } from './config';
import { JwtPayload } from 'jsonwebtoken';
import authService from './auth/auth.service';
import db from './database/connection';
import { Conversation, ConversationLoaded, Message } from './types/chat';
import { MyJwtPayload } from './types/jwtPayload';
import { AuthenticatedSocket } from './types/authenticatedSocket';
import profileService from './user/profile/profile.service';
import { Notification } from './types/notification';

class SocketService {
  private static server: Server;

  constructor(server: http.Server) {
    console.log('Socket constructor');
    SocketService.server = new Server(server, {
      cors: { origin: env.FRONT_URL, credentials: true },
    });
  }

  private validToken(authHeader: string | undefined): MyJwtPayload | undefined {
    const access_token = authService.extractAccessToken(authHeader);
    if (access_token) {
      return authService.verifyToken(access_token);
    }
    return undefined;
  }

  public static sendMessage(message: Message) {
    this.server
      ?.to(`conversation-${message.conv_id}`)
      .emit('NewMessage', message);
  }

  public static sendMatch(conversation: ConversationLoaded) {
    this.server
      ?.to([`user-${conversation.user_1.id}`, `user-${conversation.user_2.id}`])
      .emit('Match', conversation);
  }

  public static sendUnmatch(conversation: Conversation) {
    this.server
      ?.to([`user-${conversation.user_1}`, `user-${conversation.user_2}`])
      .emit('Unmatch', conversation);
  }

  public static sendNotification(notification: Notification) {
    this.server
      ?.to(`user-${notification.receiver_id}`)
      .emit('NewNotification', notification);
  }

  public static fetchSocketFromRoom(roomId: number) {
    return this.server
      ?.in(`conversation-${roomId}`)
      .fetchSockets() as unknown as Promise<AuthenticatedSocket[]>;
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
            console.log(socket.user_id + ' join conversation ' + conv.id);
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
            console.log(socket.user_id + ' left conversation ' + conv.id);
            socket.leave(`conversation-${conv.id}`);
          });
        });
      chatJoined = false;
    });
  }

  private onDisconnect(socket: AuthenticatedSocket) {
    socket.on('disconnect', () => {
      if (socket.user_id) {
        profileService.setOffline(socket.user_id);
      }
      console.log('user ' + socket.user_id + ' disconnected');
    });
  }

  public listen() {
    SocketService.server.on('connection', (socket: AuthenticatedSocket) => {
      socket.user_id = this.validToken(socket.handshake.headers.authorization)
        ?.id;
      console.log('hi', socket.user_id, socket.id);
      this.onDisconnect(socket);
      if (socket.user_id === undefined) {
        return socket.disconnect();
      }
      profileService.setOnline(socket.user_id);
      let chatJoined: boolean = false;
      socket.join(`user-${socket.user_id}`);
      this.onJoinConversations(socket, chatJoined);
      this.onLeaveConversations(socket, chatJoined);
    });
  }
}

export default SocketService;
