import conversationService from '../../../chat/conversation.service';
import db from '../../../database/connection';
import { Block } from '../../../types/block';
import { ProfileMinimum } from '../../../types/profile';
import HttpError from '../../../utils/HttpError';
import likeService from '../like/like.service';
import profileService from '../profile.service';

class BlockService {
  public blockRepo = () => db<Block>('blocked');

  public async block(blocker_id: number, blocked_id: number) {
    if (blocker_id == blocked_id) {
      throw new HttpError(400, "You can't block yourself");
    }
    await this.blockRepo()
      .insert({ blocker_id, blocked_id })
      .onConflict(['blocker_id', 'blocked_id'])
      .ignore();

    const isMatch = await conversationService.conversationExist(
      blocker_id,
      blocked_id,
    );
    if (isMatch) {
      await likeService.deleteLike(blocker_id);
      const blocker: ProfileMinimum =
        await profileService.profileNameAndAvatar(blocker_id);
      await likeService.unMatch(blocker, blocked_id);
    }
  }

  public async unblock(blocker_id: number, blocked_id: number) {
    return await this.blockRepo().where({ blocker_id, blocked_id }).del();
  }

  public async isBlocked(blocker_id: number, blocked_id: number) {
    const isBlocked = await this.blockRepo()
      .select('*')
      .where({ blocker_id, blocked_id })
      .first();
    return isBlocked ? true : false;
  }

  public async getBlockedList(blocker_id: number) {
    return await this.blockRepo()
      .select('blocked_id')
      .where('blocker_id', blocker_id);
  }
}

export default new BlockService();
