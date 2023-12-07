export enum NotificationType {
  Message = 'message',
  Like = 'like',
  Match = 'match',
  unMatch = 'unmatch',
}

export interface Notification {
  sender_id: number;
  receiver_id: number;
  type: NotificationType;
  created_at: Date;
}

export interface NotificationEvent {
  sender: { id: number; name?: string; avatar?: string };
  receiver_id: number;
  type: NotificationType;
  created_at: Date;
}
