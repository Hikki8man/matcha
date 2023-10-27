import { Conversation } from '../Types/Chat';
import HttpError from '../Utils/HttpError';
import db from '../Database/database';

class ConversationService {
  async isInConversation(user_id: number, conv_id: number) {
    try {
      return await db<Conversation>('conversation')
        .select('*')
        .where({ user_1: user_id, id: conv_id })
        .orWhere({ user_2: user_id, id: conv_id })
        .first();
    } catch (err) {
      return null;
    }
  }

  async conversationExist(user_1: number, user_2: number) {
    try {
      return await db<Conversation>('conversation')
        .select('*')
        .where({ user_1: user_1, user_2: user_2 })
        .orWhere({ user_1: user_2, user_2: user_1 })
        .first();
    } catch (err) {
      return null;
    }
  }

  async createConv(user_1: number, user_2: number) {
    try {
      //check user 2 exist?
      const conv_exist = await this.conversationExist(user_1, user_2);
      console.log('conv_exiist:', conv_exist);
      if (conv_exist) {
        return conv_exist;
      }
      const [conv] = await db<Conversation>('conversation')
        .insert({
          user_1,
          user_2,
        })
        .returning('*');
      return conv;
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async getBydId(id: number) {
    try {
      return await db<Conversation>('conversation')
        .select(
          'conversation.id',
          db.raw(
            "jsonb_build_object('id', profile1.id, 'name', profile1.name) as user_1",
          ),
          db.raw(
            "jsonb_build_object('id', profile2.id, 'name', profile2.name) as user_2",
          ),
          db.raw(`
            CASE
                WHEN COUNT(msg.sender_id) > 0
                THEN jsonb_agg(jsonb_build_object('sender_id', msg.sender_id, 'conv_id', msg.conv_id, 'content', msg.content))
                ELSE '[]'::jsonb
            END as messages
        `),
        )
        .leftJoin('profile as profile1', 'conversation.user_1', 'profile1.id')
        .leftJoin('profile as profile2', 'conversation.user_2', 'profile2.id')
        .leftJoin('message as msg', 'conversation.id', 'msg.conv_id')
        .where('conversation.id', id)
        .groupBy('conversation.id', 'profile1.id', 'profile2.id')
        .first();
    } catch (err) {
      console.log('errror', err);
    }
  }

  getAll(id: number) {
    return db<Conversation>('conversation')
      .select(
        'conversation.id',
        db.raw(
          "jsonb_build_object('id', profile1.id, 'name', profile1.name) as user_1",
        ),
        db.raw(
          "jsonb_build_object('id', profile2.id, 'name', profile2.name) as user_2",
        ),
        'latest_message.content as last_message_content',
        'latest_message.created_at as last_message_created_at',
      )
      .leftJoin(
        db
          .select('conv_id', 'content', 'created_at')
          .from('message')
          .orderBy('created_at', 'desc')
          .limit(1)
          .as('latest_message'),
        'latest_message.conv_id',
        'conversation.id',
      )
      .leftJoin('profile as profile1', 'conversation.user_1', 'profile1.id')
      .leftJoin('profile as profile2', 'conversation.user_2', 'profile2.id')
      .where('user_1', id)
      .orWhere('user_2', id);
  }
}
// Conversation {
//   id: 1,
//   user_1: {
//     user_id:
//     name:
//     birth_date:
//     gender:
//   },
//   user_2: {
//     user_id:
//     name:
//     birth_date:
//     gender:
//   },
// }

// Conversation {
//   id: 1,
//   user_id: 2,
//   user_name: "name"
// }

// [
//   {
//     id: 1,
//     user_id: 7,
//     user_name: 'Alice',
//     last_message_content: 'oui',
//     last_message_created_at: '2023-10-20T14:57:23.441Z',
//   },
//   {
//     id: 2,
//     user_id: 1,
//     user_name: 'Chaf',
//     last_message_content: null,
//     last_message_created_at: null,
//   },
// ];

export default new ConversationService();
