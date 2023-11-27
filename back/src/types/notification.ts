export enum NotificationType {
  Message = 'message',
}

export interface Notification {
  sender_id: number;
  receiver_id: number;
  type: NotificationType;
  created_at: Date;
}
