import e from 'express';
import { Like, Profile } from '../Types/Profile';
import HttpError from '../Utils/HttpError';
import db from '../Database/database';

class ProfileService {
  async get_by_id(id: number) {
    try {
      return await db<Profile>('profile').select('*').where('id', id).first();
      // return await db.oneOrNone(
      //   `SELECT profile.*, json_agg(photo.*) AS photos FROM profile LEFT JOIN photo ON profile.user_id = photo.user_id WHERE profile.user_id = $1 GROUP BY profile.user_id`,
      //   id
      // );
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }

  async get_all(id: number) {
    try {
      return await db<Profile>('profile').select('*').whereNot('id', id);
    } catch (e: any) {
      console.log('error in getting all profile', e.message);
      return undefined;
    }
  }

  async like(liker_id: number, liked_id: number) {
    var liker: Like | undefined = undefined;
    var liked: Like | undefined = undefined;

    const existingLike: Like[] = await db<Like>('likes')
      .select('*')
      .where({ liker_id, liked_id })
      .orWhere({ liker_id: liked_id, liked_id: liker_id });

    if (existingLike.length === 1) {
      if (existingLike[0].liker_id === liker_id) {
        liker = existingLike[0];
      } else {
        liked = existingLike[0];
      }
    } else if (existingLike.length === 2) {
      if (existingLike[0].liker_id === liker_id) {
        liker = existingLike[0];
        liked = existingLike[1];
      } else {
        liker = existingLike[1];
        liked = existingLike[2];
      }
    }

    // if liker didnt like already
    if (!liker) {
      const [like] = await db<Like>('likes')
        .insert({
          liker_id,
          liked_id,
        })
        .returning('*');
      // if liked then Match
      return like;
    }
    // else unlike
    else {
      await db<Like>('likes').del().where('id', liker.id);
      // if liked then Unmatch
      return; //SUCCES unlike
    }
  }
}

export default new ProfileService();
