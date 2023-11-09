import { Photo } from '../../types/photo';
import db from '../../database/connection';
import HttpError from '../../utils/HttpError';
import { validateMIMEType } from 'validate-image-type';
import fs from 'fs/promises';

class PhotoService {
  async uploadAvatar(user_id: number, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new HttpError(400, 'Please upload a file');
    }
    const { filename, path, size, mimetype } = file;
    const result = await validateMIMEType(file.path, {
      originalFilename: file.originalname,
      allowMimeTypes: ['image/jpeg', 'image/png'],
    });

    if (!result.ok) {
      await fs.unlink(file.path);
      throw new HttpError(400, 'Invalid file type');
    }

    await this.removeOldAvatar(user_id);

    try {
      await db<Photo>('photo').insert({
        user_id: user_id,
        filename: filename,
        path: path,
        size: size,
        content_type: mimetype,
        avatar: true,
      });
    } catch (err) {
      await fs.unlink(file.path);
      console.log('err', err);
    }
  }

  async getProfilePhotos(id: number) {
    try {
      return await db<Photo>('photo')
        .select('*')
        .where('user_id', id)
        .andWhere('avatar', false);
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

  async removeOldAvatar(user_id: number) {
    const [toRemove] = await db<Photo>('photo')
      .where('user_id', user_id)
      .andWhere('avatar', true)
      .del()
      .returning('*');
    console.log('toremove: ', toRemove);
    if (!toRemove.path.startsWith('src/')) {
      await fs.unlink(toRemove.path);
    }
  }
}

export default new PhotoService();
