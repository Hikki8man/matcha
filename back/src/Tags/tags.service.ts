import db from '../Database/connection';
import { ProfileTag } from '../Types/Profile-Tag';
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

  async editTags(user_id: number, tags: Tag[]) {
    try {
      const tagIds = tags.map((tag) => tag.id);
      await db<ProfileTag>('profile_tags')
        .whereNotIn('tag_id', tagIds)
        .andWhere('profile_id', user_id)
        .del();

      const insertData = tags.map((tag) => ({
        profile_id: user_id,
        tag_id: tag.id,
      }));
      if (insertData.length) {
        return await db<ProfileTag>('profile_tags')
          .insert(insertData)
          .onConflict(['profile_id', 'tag_id'])
          .ignore();
      }
      return true;
    } catch (err) {
      console.error(err);
    }
  }
}

export default new TagsService();
