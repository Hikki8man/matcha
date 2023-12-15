import { Conversation, ConversationLoaded, Message } from '../types/chat';
import HttpError from '../utils/HttpError';
import db from '../database/connection';
import SocketService from '../socket.service';
import { PhotoType } from '../types/photo';

class ConversationService {
  async conversationExist(user_1: number, user_2: number) {
    try {
      return await db<Conversation>('conversation')
        .select('*')
        .where({ user_1: user_1, user_2: user_2 })
        .orWhere({ user_1: user_2, user_2: user_1 })
        .first();
    } catch (err) {
      return undefined;
    }
  }

  async createConv(user_1: number, user_2: number) {
    try {
      //check user 2 exist?
      // const conv_exist = await this.conversationExist(user_1, user_2);
      // console.log('conv_exiist:', conv_exist);
      // if (conv_exist) {
      //   return conv_exist;
      // }
      const [conv] = await db<Conversation>('conversation')
        .insert({
          user_1,
          user_2,
        })
        .returning('*');
      // return this.getBydIdWithUsers(conv.id);
      return conv;
    } catch (err: any) {
      return undefined;
    }
  }

  async deleteConv(user_1: number, user_2: number) {
    try {
      const [conv] = await db<Conversation>('conversation')
        .where({ user_1, user_2 })
        .orWhere({ user_1: user_2, user_2: user_1 })
        .del()
        .returning('*');
      return conv;
    } catch (err: any) {
      console.log(err.message);
      return undefined;
    }
  }

  async getBydIdWithMessages(
    id: number,
  ): Promise<ConversationLoaded | undefined> {
    try {
      return await db<ConversationLoaded>('conversation')
        .select(
          'conversation.id',
          db.raw(`
          jsonb_build_object(
            'id', profile1.id,
            'name', profile1.name,
            'avatar', avatar1.path
          ) as user_1
        `),
          db.raw(`
          jsonb_build_object(
            'id', profile2.id,
            'name', profile2.name,
            'avatar', avatar2.path
            ) as user_2
        `),
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
        .leftJoin('photo as avatar1', function () {
          this.on('profile1.id', '=', 'avatar1.user_id').andOn(
            db.raw('avatar1.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('photo as avatar2', function () {
          this.on('profile2.id', '=', 'avatar2.user_id').andOn(
            db.raw('avatar2.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('message as msg', 'conversation.id', 'msg.conv_id')
        .where('conversation.id', id)
        .groupBy(
          'conversation.id',
          'profile1.id',
          'profile2.id',
          'avatar1.path',
          'avatar2.path',
        )
        .first();
    } catch (err) {
      console.log('errror', err);
      return undefined;
    }
  }

  async getBydIdWithUsers(id: number): Promise<ConversationLoaded | undefined> {
    try {
      return await db<ConversationLoaded>('conversation')
        .select(
          'conversation.id',
          db.raw(`
            jsonb_build_object(
              'id', profile1.id,
              'name', profile1.name,
              'avatar', avatar1.path
            ) as user_1
          `),
          db.raw(`
            jsonb_build_object(
              'id', profile2.id,
              'name', profile2.name,
              'avatar', avatar2.path
              ) as user_2
          `),
        )
        .leftJoin('profile as profile1', 'conversation.user_1', 'profile1.id')
        .leftJoin('profile as profile2', 'conversation.user_2', 'profile2.id')
        .leftJoin('photo as avatar1', function () {
          this.on('profile1.id', '=', 'avatar1.user_id').andOn(
            db.raw('avatar1.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('photo as avatar2', function () {
          this.on('profile2.id', '=', 'avatar2.user_id').andOn(
            db.raw('avatar2.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .where('conversation.id', id)
        .groupBy(
          'conversation.id',
          'profile1.id',
          'profile2.id',
          'avatar1.path',
          'avatar2.path',
        )
        .first();
    } catch (err) {
      console.log('errror', err);
      return undefined;
    }
  }

  getAll(id: number) {
    return db<Conversation>('conversation')
      .select(
        'conversation.id',
        db.raw(`
        jsonb_build_object(
          'id', profile1.id,
          'name', profile1.name,
          'avatar', avatar1.path
        ) as user_1
      `),
        db.raw(`
        jsonb_build_object(
          'id', profile2.id,
          'name', profile2.name,
          'avatar', avatar2.path
          ) as user_2
      `),
        db.raw('"message"."content" as "last_message_content"'),
        db.raw('"message"."created_at" as "last_message_created_at"'),
      )
      .leftJoin('message', 'message.id', 'conversation.last_message')
      .leftJoin('profile as profile1', 'conversation.user_1', 'profile1.id')
      .leftJoin('profile as profile2', 'conversation.user_2', 'profile2.id')
      .leftJoin('photo as avatar1', function () {
        this.on('profile1.id', '=', 'avatar1.user_id').andOn(
          db.raw('avatar1.photo_type = ?', [PhotoType.Avatar]),
        );
      })
      .leftJoin('photo as avatar2', function () {
        this.on('profile2.id', '=', 'avatar2.user_id').andOn(
          db.raw('avatar2.photo_type = ?', [PhotoType.Avatar]),
        );
      })
      .where('user_1', id)
      .orWhere('user_2', id);
  }

  async updateLastMessage(msg: Message) {
    try {
      const [updatedConv] = await db<Conversation>('conversation')
        .update('last_message', msg.id)
        .where('id', msg.conv_id)
        .returning('*');
      SocketService.sendLastMessageUpdate(
        updatedConv.user_1,
        updatedConv.user_2,
        msg,
      );
      console.log('updated conv', updatedConv);
    } catch (e) {}
  }
}

export default new ConversationService();
