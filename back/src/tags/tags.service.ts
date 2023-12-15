import db from '../database/connection';
import { ProfileTag } from '../types/profileTag';
import { Tag } from '../types/tag';
import HttpError from '../utils/HttpError';

class TagsService {
  public tagRepo = () => db<Tag>('tags');
  public profileTagRepo = () => db<ProfileTag>('profile_tags');

  async getAll() {
    try {
      return await this.tagRepo().select('*');
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  async editTags(user_id: number, tags: Tag[]) {
    if (tags.length > 5) throw new HttpError(400, 'Too many tags');
    try {
      const tagIds = tags.map((tag) => tag.id);
      await this.profileTagRepo()
        .whereNotIn('tag_id', tagIds)
        .andWhere('profile_id', user_id)
        .del();

      const insertData = tags.map((tag) => ({
        profile_id: user_id,
        tag_id: tag.id,
      }));
      if (insertData.length) {
        return await this.profileTagRepo()
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
