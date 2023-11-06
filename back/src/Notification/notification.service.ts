import db from '../Database/connection';
import { AuthenticatedSocket } from '../Types/AuthenticatedSocket';
import SocketService from '../socket.service';
import { NotificationType, Notification } from '../Types/Notification';

class NotificationService {
  getAll(user_id: number) {
    return db<Notification>('notification')
      .select('*')
      .where('receiver_id', user_id);
  }

  async deleteMessagesNotif(receiver_id: number, sender_id: number) {
    try {
      return await db<Notification>('notification')
        .where({ sender_id: sender_id, receiver_id: receiver_id })
        .del();
    } catch (err) {
      return undefined;
    }
  }

  async sendMessageNotification(
    sender_id: number,
    receiver_id: number,
    conversation_id: number,
  ) {
    const socketsInConv = (await SocketService.getServer
      .in(`conversation-${conversation_id}`)
      .fetchSockets()) as unknown as AuthenticatedSocket[];

    socketsInConv.forEach((socket) => {
      console.log('socket in conv: ', socket.user_id);
    });
    const receiverIsInConv = socketsInConv.some(
      (socket) => socket.user_id === receiver_id,
    );

    if (!receiverIsInConv) {
      try {
        const [notification] = await db<Notification>('notification')
          .insert({
            sender_id,
            receiver_id,
            type: NotificationType.Message,
          })
          .returning('*');
        console.log('sending notif');
        SocketService.getServer
          .to(`user-${receiver_id}`)
          .emit('NewNotification', notification);
      } catch (err) {}
    }
  }
}

export default new NotificationService();
