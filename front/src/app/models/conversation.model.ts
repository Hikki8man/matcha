export interface ConversationModel {
    id: number;
    user_1: { id: number; name: string; avatar: string };
    user_2: { id: number; name: string; avatar: string };
    last_message_content: string;
    last_message_created_at: Date;
    send_at: string;
    avatar: string;
}

export interface ConversationApi {
    id: number;
    user_1: { id: number; name: string };
    user_2: { id: number; name: string };
    last_message_content: string;
    last_message_created_at: Date;
}
