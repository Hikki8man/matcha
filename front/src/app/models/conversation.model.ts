export interface ConversationModel {
    id: number;
    user_1: { id: number; name: string };
    user_2: { id: number; name: string };
    last_message_content: string;
    last_message_created_at: Date;
}