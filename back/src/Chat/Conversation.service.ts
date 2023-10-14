import {Conversation} from "../Types/Chat";
import HttpError from "../Utils/HttpError";
import db from "../database";

class ConversationService {
  async isInConversation(user_id: number, conv_id: number) {
    try {
      return await db<Conversation>("conversation")
        .select("*")
        .where({user_1: user_id, id: conv_id})
        .orWhere({user_2: user_id, id: conv_id})
        .first();
    } catch (err) {
      return null;
    }
  }

  async conversationExist(user_1: number, user_2: number) {
    try {
      return await db<Conversation>("conversation")
        .select("*")
        .where({user_1: user_1, user_2: user_2})
        .orWhere({user_1: user_2, user_2: user_1})
        .first();
    } catch (err) {
      return null;
    }
  }

  async createConv(user_1: number, user_2: number) {
    try {
      //check user 2 exist?
      const conv_exist = await this.conversationExist(user_1, user_2);
      console.log("conv_exiist:", conv_exist);
      if (conv_exist) {
        throw new HttpError(400, "Conversation already exist");
      }
      const conv = await db<Conversation>("conversation")
        .insert({
          user_1,
          user_2,
        })
        .returning("*");
      return conv;
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async getBydId(id: string) {
    try {
      return await db<Conversation>("conversation")
        .select(
          "conversation.id",
          db.raw(
            "jsonb_build_object('user_id', profile1.user_id, 'name', profile1.name, 'birth_date', profile1.birth_date, 'gender', profile1.gender) as user_1"
          ),
          db.raw(
            "jsonb_build_object('user_id', profile2.user_id, 'name', profile2.name, 'birth_date', profile2.birth_date, 'gender', profile2.gender) as user_2"
          ),
          db.raw(`
            CASE
                WHEN COUNT(msg.sender_id) > 0
                THEN jsonb_agg(jsonb_build_object('sender_id', msg.sender_id, 'conv_id', msg.conv_id, 'content', msg.content))
                ELSE '[]'::jsonb
            END as messages
        `)
        )
        .leftJoin(
          "profile as profile1",
          "conversation.user_1",
          "profile1.user_id"
        )
        .leftJoin(
          "profile as profile2",
          "conversation.user_2",
          "profile2.user_id"
        )
        .leftJoin("message as msg", "conversation.id", "msg.conv_id")
        .where("conversation.id", id)
        .groupBy("conversation.id", "profile1.user_id", "profile2.user_id");
    } catch (err) {
      console.log("errror", err);
    }
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

export default new ConversationService();
