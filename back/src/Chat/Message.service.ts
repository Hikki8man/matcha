import HttpError from "../Utils/HttpError";
import db from "../database";
import convService from "./Conversation.service";

class MessageService {
  async create(sender_id: number, conv_id: number, content: string) {
    const in_conv = await convService.isInConversation(sender_id, conv_id);
    if (!in_conv) {
      console.error(`user ${sender_id} is not in conversation ${conv_id}`);
      throw new HttpError(
        400,
        `user ${sender_id} is not in conversation ${conv_id}`
      );
    }
    return await db.one(
      `INSERT INTO message (sender_id, conv_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [sender_id, conv_id, content]
    );
  }
}

export default new MessageService();
