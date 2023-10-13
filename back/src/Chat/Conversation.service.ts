import HttpError from "../Utils/HttpError";
import db from "../database";

class ConversationService {
  async isInConversation(user_id: number, conv_id: number) {
    try {
      return await db.oneOrNone(
        `SELECT * FROM conversation WHERE (user_1 = $1 AND id = $2) OR (user_2 = $1 AND id = $2)`,
        [user_id, conv_id]
      );
    } catch (err) {
      return null;
    }
  }

  async conversationExist(user_1: number, user_2: number) {
    try {
      return await db.oneOrNone(
        `SELECT * FROM conversation WHERE (user_1 = $1 AND user_2 = $2) OR (user_1 = $2 AND user_2 = $1)`,
        [user_1, user_2]
      );
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
      return await db.one(
        `INSERT INTO conversation (user_1, user_2) VALUES ($1, $2) RETURNING *`,
        [user_1, user_2]
      );
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async getBydId(id: string) {
    return await db.oneOrNone(
      `
      SELECT id,
        (
          SELECT
            row_to_json(profile)
          FROM
            profile
          WHERE
            user_id = conv.user_1
        ) as user_1,
        (
          SELECT
            row_to_json(profile)
          FROM
            profile
          WHERE
            user_id = conv.user_2
        ) as user_2
      FROM
        conversation conv
      WHERE
        conv.id = $1
      `,
      [id]
    );
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
