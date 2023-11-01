import { Message } from '../Types/Chat';
import HttpError from '../Utils/HttpError';
import db from '../Database/connection';
import convService from './Conversation.service';

class MessageService {
  async create(sender_id: number, conv_id: number, content: string) {
    const in_conv = await convService.isInConversation(sender_id, conv_id);
    if (!in_conv) {
      throw new HttpError(
        400,
        `user ${sender_id} is not in conversation ${conv_id}`,
      );
    }
    const [msg] = await db<Message>('message')
      .insert({
        sender_id,
        conv_id,
        content,
      })
      .returning('*');
    return msg;
  }
}

export default new MessageService();
