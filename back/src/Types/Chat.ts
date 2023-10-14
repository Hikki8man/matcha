export interface Message {
  id: number;
  sender_id: number;
  conv_id: number;
  content: string;
  created_at: Date;
}

export interface Conversation {
  id: number;
  user_1: number;
  user_2: number;
}
