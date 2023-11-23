import db from '../../../database/connection';
import { Block } from '../../../types/block';
import HttpError from '../../../utils/HttpError';

class BlockService {
  public blockRepo = () => db<Block>('blocked');

  public block(blocker_id: number, blocked_id: number) {
    if (blocker_id == blocked_id) {
      throw new HttpError(400, "You can't block yourself");
    }
    return this.blockRepo()
      .insert({ blocker_id, blocked_id })
      .onConflict(['blocker_id', 'blocked_id'])
      .ignore();
  }

  public unblock(blocker_id: number, blocked_id: number) {
    return this.blockRepo().where({ blocker_id, blocked_id }).del();
  }
}

export default new BlockService();
