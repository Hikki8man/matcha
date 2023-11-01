import { Photo } from '../Types/Photo';
import db from '../Database/connection';

class PhotoService {
  async insert(user_id: number, file: Express.Multer.File) {
    const { filename, path, size } = file;
    console.log('userid', user_id);
    try {
      await db<Photo>('photo').insert({
        user_id: user_id,
        filename: filename,
        path: path,
        size: size,
      });
    } catch (err) {
      console.log('err', err);
    }
  }

  async getByProfileId(id: number) {
    try {
      return await db<Photo>('photo').select('*').where('user_id', id).first();
      // return await db.one(`SELECT * FROM photo WHERE user_id = $1`, id);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new PhotoService();
