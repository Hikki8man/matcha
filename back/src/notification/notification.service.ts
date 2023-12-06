import db from '../database/connection';
import { AuthenticatedSocket } from '../types/authenticatedSocket';
import SocketService from '../socket.service';
import { Notification, NotificationType } from '../types/notification';

class NotificationService {
  public notificationRepo = () => db<Notification>('notification');

  getAll(user_id: number) {
    return this.notificationRepo().select('*').where('receiver_id', user_id);
  }

  async deleteMessagesNotif(receiver_id: number, sender_id: number) {
    try {
      return await this.notificationRepo()
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
    const socketsInRoom =
      await SocketService.fetchSocketFromRoom(conversation_id);
    const receiverIsInConv = socketsInRoom.some(
      (socket) => socket.user_id === receiver_id,
    );

    if (!receiverIsInConv) {
      try {
        const [notif] = await this.notificationRepo()
          .insert({
            sender_id,
            receiver_id,
            type: NotificationType.Message,
          })
          .returning('*');
        SocketService.sendNotification(notif);
      } catch (err) {}
    }
  }

  async createNotification(
    sender: { id: number; name: string },
    receiver_id: number,
    type: NotificationType,
  ) {
    try {
      const [notif] = await this.notificationRepo()
        .insert({
          sender_id: sender.id,
          receiver_id,
          type,
        })
        .returning('*');
      notif.name = sender.name;
      SocketService.sendNotification(notif);
    } catch (err) {}
  }
}

export default new NotificationService();
