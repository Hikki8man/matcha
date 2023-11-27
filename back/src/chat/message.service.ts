import { Message } from '../types/chat';
import HttpError from '../utils/HttpError';
import db from '../database/connection';
import convService from './conversation.service';

class MessageService {
  async create(sender_id: number, receiver_id: number, content: string) {
    const conv = await convService.conversationExist(sender_id, receiver_id);
    if (!conv) {
      throw new HttpError(400, `user ${sender_id} is not in conversation`);
    }
    const [msg] = await db<Message>('message')
      .insert({
        sender_id,
        conv_id: conv.id,
        content,
      })
      .returning('*');
    await convService.updateLastMessage(msg);
    return msg;
  }
}

export default new MessageService();
