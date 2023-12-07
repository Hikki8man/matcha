import conversationService from '../../../chat/conversation.service';
import db from '../../../database/connection';
import { Block } from '../../../types/block';
import { ProfileMinimum } from '../../../types/profile';
import HttpError from '../../../utils/HttpError';
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
      await profileService.deleteLike(blocker_id);
      const blocker: ProfileMinimum =
        await profileService.profileNameAndAvatar(blocker_id);
      await profileService.unMatch(blocker, blocked_id);
    }
  }

  public unblock(blocker_id: number, blocked_id: number) {
    return this.blockRepo().where({ blocker_id, blocked_id }).del();
  }
}

export default new BlockService();
