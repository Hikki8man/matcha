import db from '../database/connection';
import SocketService from '../socket.service';
import {
  Notification,
  NotificationEvent,
  NotificationType,
} from '../types/notification';
import { PhotoType } from '../types/photo';
import { ProfileMinimum } from '../types/profile';
import blockService from '../user/profile/block/block.service';

class NotificationService {
  public notificationRepo = () => db<Notification>('notification');

  getAll(user_id: number) {
    return this.notificationRepo()
      .select(
        'notification.*',
        db.raw(`
            jsonb_build_object(
              'id', sender.id,
              'name', sender.name,
               'avatar', avatar.path
            ) as sender
          `),
      )
      .leftJoin('profile as sender', 'notification.sender_id', 'sender.id')
      .leftJoin('photo as avatar', function () {
        this.on('sender.id', '=', 'avatar.user_id').andOn(
          db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
        );
      })
      .where('notification.receiver_id', user_id)
      .orderBy('notification.created_at', 'desc');
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

        const notification: NotificationEvent = {
          sender: { id: sender_id },
          receiver_id: notif.receiver_id,
          created_at: notif.created_at,
          type: notif.type,
        };
        SocketService.sendNotification(notification);
      } catch (err) {}
    }
  }

  async createNotification(
    sender: ProfileMinimum,
    receiver_id: number,
    type: NotificationType,
  ) {
    try {
      const isBlocked = await blockService.isBlocked(receiver_id, sender.id);
      if (isBlocked) {
        return;
      }
      const [notif] = await this.notificationRepo()
        .insert({
          sender_id: sender.id,
          receiver_id,
          type,
        })
        .returning('*');

      const notification: NotificationEvent = {
        sender,
        receiver_id: notif.receiver_id,
        created_at: notif.created_at,
        type: notif.type,
      };
      SocketService.sendNotification(notification);
    } catch (err) {}
  }

  async readNotifications(id: number) {
    await this.notificationRepo()
      .where({ receiver_id: id })
      .update({ read: true });
  }
}

export default new NotificationService();
