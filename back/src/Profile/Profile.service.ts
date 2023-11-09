import { CompletedSteps, Gender, Like, Profile } from '../Types/Profile';
import HttpError from '../Utils/HttpError';
import db from '../Database/connection';
import conversationService from '../Chat/Conversation.service';

class ProfileService {
  async get_by_id(id: number) {
    try {
      return await db<Profile>('profile')
        .select('profile.*', 'photo.path as avatar_path')
        // .select(db.raw('MAX(photo.path) as photo_path'))
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .leftJoin('user_account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .leftJoin('photo as photo', function () {
          this.on('profile.id', '=', 'photo.user_id').andOn(
            db.raw('photo.avatar = true'),
          );
        })
        .where('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id', 'photo.path')
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }

  async get_all(id: number) {
    try {
      return await db<Profile>('profile')
        .select('profile.*')
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .leftJoin('user_account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .whereNot('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id');
    } catch (e: any) {
      console.log('error in getting all profile', e.message);
      return undefined;
    }
  }

  async editName(id: number, name: string) {
    try {
      return await db<Profile>('profile')
        .update({ name: name })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }

  async editBio(id: number, bio: string) {
    try {
      return await db<Profile>('profile').update({ bio: bio }).where('id', id);
    } catch (e: any) {
      console.log('error updating bio', e.message);
      return undefined;
    }
  }

  async editGender(id: number, gender: Gender) {
    try {
      return await db<Profile>('profile')
        .update({ gender: gender })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }

  async updateCompteteSteps(id: number, step: CompletedSteps) {
    try {
      return await db<Profile>('profile')
        .update({ completed_steps: step })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }

  async setOnline(id: number) {
    try {
      return await db<Profile>('profile')
        .update({ online: true })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }

  async setOffline(id: number) {
    try {
      return await db<Profile>('profile')
        .update({ online: false, last_online: db.fn.now() })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }

  async like(liker_id: number, liked_id: number) {
    const existingLike: Like[] = await db<Like>('likes')
      .select('*')
      .where({ liker_id, liked_id })
      .orWhere({ liker_id: liked_id, liked_id: liker_id });

    const liker: Like | undefined = existingLike.find(
      (like) => like.liker_id === liker_id,
    );
    const liked: Like | undefined = existingLike.find(
      (like) => like.liked_id === liked_id,
    );

    // if liker didnt like already
    if (!liker) {
      const [like] = await db<Like>('likes')
        .insert({
          liker_id,
          liked_id,
        })
        .returning('*');
      // if liked then Match
      if (liked) {
        await conversationService.createConv(liker_id, liked_id);
      }
      return like;
    } else {
      // unlike
      await db<Like>('likes').del().where('id', liker.id);
      // if liked then Unmatch
      return; //SUCCES unlike
    }
  }
}

export default new ProfileService();
