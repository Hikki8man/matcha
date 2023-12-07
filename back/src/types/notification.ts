export enum NotificationType {
  Message = 'message',
  Like = 'like',
  Match = 'match',
  unMatch = 'unmatch',
  View = 'view',
}

export interface Notification {
  sender_id: number;
  receiver_id: number;
  type: NotificationType;
  created_at: Date;
  read: boolean;
}

export interface NotificationEvent {
  sender: { id: number; name?: string; avatar?: string };
  receiver_id: number;
  type: NotificationType;
  created_at: Date;
}
