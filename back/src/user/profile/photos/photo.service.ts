import { Photo, PhotoType } from '../../../types/photo';
import db from '../../../database/connection';
import HttpError from '../../../utils/HttpError';
import { validateMIMEType } from 'validate-image-type';
import fs from 'fs/promises';

class PhotoService {
  async uploadPhoto(
    user_id: number,
    photo_type: PhotoType,
    file: Express.Multer.File | undefined,
  ) {
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

    await this.removeOldPhoto(user_id, photo_type);

    try {
      await db<Photo>('photo').insert({
        user_id: user_id,
        filename: filename,
        path: path,
        size: size,
        content_type: mimetype,
        photo_type: photo_type,
      });
    } catch (err) {
      await fs.unlink(file.path);
    }
  }

  getProfilePhotos(id: number) {
    return db<Photo>('photo')
      .select('*')
      .where('user_id', id)
      .andWhereNot('photo_type', PhotoType.Avatar);
  }

  getProfileAvatar(id: number) {
    return db<Photo>('photo')
      .select('*')
      .where('user_id', id)
      .andWhere('photo_type', PhotoType.Avatar)
      .first();
  }

  async removeOldPhoto(user_id: number, photo_type: PhotoType) {
    const [toRemove] = await db<Photo>('photo')
      .where('user_id', user_id)
      .andWhere('photo_type', photo_type)
      .del()
      .returning('*');
    if (toRemove && !toRemove.path.startsWith('public/')) {
      await fs.unlink(toRemove.path);
    }
  }
}

export default new PhotoService();
