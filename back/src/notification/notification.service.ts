import db from '../database/connection';
import { AuthenticatedSocket } from '../types/authenticatedSocket';
import SocketService from '../socket.service';
import { NotificationType, Notification } from '../types/notification';

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
        .andWhere('type', NotificationType.Message)
        .del();
    } catch (err) {
      return undefined;
    }
  }

  async createMessageNotification(
    sender_id: number,
    receiver_id: number,
    conversation_id: number,
  ) {
    // const socketsInConv = (await SocketService.getServer
    //   ?.in(`conversation-${conversation_id}`)
    //   .fetchSockets()) as unknown as AuthenticatedSocket[];

    const socketsInRoom =
      await SocketService.fetchSocketFromRoom(conversation_id);
    const receiverIsInConv = socketsInRoom.some(
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
        SocketService.sendNotification(notification);
      } catch (err) {}
    }
  }
}

export default new NotificationService();
