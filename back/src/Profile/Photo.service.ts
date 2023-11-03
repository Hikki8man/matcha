import { Photo } from '../Types/Photo';
import db from '../Database/connection';

class PhotoService {
  async insert(user_id: number, file: Express.Multer.File, avatar = false) {
    const { filename, path, size, mimetype } = file;
    try {
      await db<Photo>('photo').insert({
        user_id: user_id,
        filename: filename,
        path: path,
        size: size,
        content_type: mimetype,
        avatar,
      });
    } catch (err) {
      console.log('err', err);
    }
  }

  async getProfilePhotos(id: number) {
    try {
      return await db<Photo>('photo').select('*').where('user_id', id);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async getProfileAvatar(id: number) {
    try {
      return await db<Photo>('photo')
        .select('*')
        .where('user_id', id)
        .andWhere('avatar', true)
        .first();
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}

export default new PhotoService();
