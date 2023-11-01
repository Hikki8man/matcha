import db from '../Database/connection';
import { Tag } from '../Types/Tag';

class TagsService {
  async getAll() {
    try {
      return await db<Tag>('tags').select('*');
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  async add(user_id: number, tags: Tag[]) {
    try {
      for (const tag of tags) {
        await db('profile_tags')
          .insert({ profile_id: user_id, tag_id: tag.id })
          .onConflict(['profile_id', 'tag_id'])
          .ignore();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async remove(user_id: number, tags: Tag[]) {
    try {
      for (const tag of tags) {
        await db('profile_tags')
          .where({ profile_id: user_id, tag_id: tag.id })
          .del();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default new TagsService();
