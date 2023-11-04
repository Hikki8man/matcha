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
      for (const tag of tags) {
        await db<ProfileTag>('profile_tags')
          .insert({ profile_id: user_id, tag_id: tag.id })
          .onConflict(['profile_id', 'tag_id'])
          .ignore();
      }
      const tagIds = tags.map((tag) => tag.id);
      await db<ProfileTag>('profile_tags')
        .whereNotIn('tag_id', tagIds)
        .andWhere('profile_id', user_id)
        .del();
    } catch (err) {
      console.error(err);
    }
  }
}

export default new TagsService();
