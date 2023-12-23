import http from 'http';
import { Server } from 'socket.io';
import { env } from './config';
import authService from './auth/auth.service';
import db from './database/connection';
import { Conversation, ConversationLoaded, Message } from './types/chat';
import { MyJwtPayload } from './types/jwtPayload';
import { AuthenticatedSocket } from './types/authenticatedSocket';
import profileService from './user/profile/profile.service';
import { Notification, NotificationEvent } from './types/notification';
import { LikeEvent, ProfileViewEvent } from './types/profile';

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
  public static sendLastMessageUpdate(
    user_1: number,
    user_2: number,
    message: Message,
  ) {
    this.server
      ?.to(`user-${user_1}`)
      .to(`user-${user_2}`)
      .emit('LastMessageUpdate', message);
  }

  public static sendLikeEvent(dest: number, likeEvent: LikeEvent) {
    this.server?.to(`user-${dest}`).emit('LikeEvent', likeEvent);
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

  public static sendNotification(notification: NotificationEvent) {
    this.server
      ?.to(`user-${notification.receiver_id}`)
      .emit('NewNotification', notification);
  }

  public static sendProfileView(viewed_id: number, profile: ProfileViewEvent) {
    this.server?.to(`user-${viewed_id}`).emit('ProfileView', profile);
  }

  public static fetchSocketFromRoom(roomId: number) {
    return this.server
      ?.in(`conversation-${roomId}`)
      .fetchSockets() as unknown as Promise<AuthenticatedSocket[]>;
  }

  public static sendLogout(user_id: number) {
    this.server?.to(`user-${user_id}`).emit('Logout');
  }

  private onJoinConversation(socket: AuthenticatedSocket) {
    socket.on('JoinConversation', async (conv_id: number) => {
      if (typeof conv_id !== 'number') {
        return;
      }
      const inConv = await db<Conversation>('conversation')
        .select('id')
        .where((builder) => {
          builder
            .where('user_1', socket.user_id)
            .orWhere('user_2', socket.user_id);
        })
        .andWhere('id', conv_id)
        .first();

      if (inConv) {
        console.log(socket.user_id + ' join conversation ' + conv_id);
        socket.join(`conversation-${conv_id}`);
      }
    });
  }

  private onLeaveConversation(socket: AuthenticatedSocket) {
    socket.on('LeaveConversation', async (conv_id: number) => {
      if (typeof conv_id !== 'number') {
        return;
      }
      console.log(socket.user_id + ' left conversation ' + conv_id);
      socket.leave(`conversation-${conv_id}`);
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
      this.onDisconnect(socket);
      if (socket.user_id === undefined) {
        return socket.disconnect();
      }
      profileService.setOnline(socket.user_id);
      socket.join(`user-${socket.user_id}`);
      this.onJoinConversation(socket);
      this.onLeaveConversation(socket);
    });
  }
}

export default SocketService;
