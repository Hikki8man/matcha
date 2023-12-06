export enum NotificationType {
  Message = 'message',
  Like = 'like',
  Match = 'match',
  unMatch = 'unmatch',
}

export interface Notification {
  sender_id: number;
  receiver_id: number;
  name?: string;
  type: NotificationType;
  created_at: Date;
}
