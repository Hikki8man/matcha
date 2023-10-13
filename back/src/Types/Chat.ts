export interface Message {
  id: number;
  sender_id: number;
  conv_id: number;
  content: string;
  created_at: Date;
}
