import { Message } from '../Types/Chat';
import HttpError from '../Utils/HttpError';
import db from '../Database/connection';
import convService from './Conversation.service';
import SocketService from '../socket.service';

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
    return msg;
  }

  sendMessage(message: Message) {
    SocketService.getServer
      .to(`conversation-${message.conv_id}`)
      .emit('NewMessage', message);
  }
}

export default new MessageService();
