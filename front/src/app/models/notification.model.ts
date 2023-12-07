export enum NotificationType {
    Message = 'message',
}

export interface Notification {
    sender: { id: number; name: string; avatar: string };
    receiver_id: number;
    type: NotificationType;
    created_at: Date;
}
