import { CompletedSteps, Gender, Like, Profile } from '../Types/Profile';
import HttpError from '../Utils/HttpError';
import db from '../Database/database';
import conversationService from '../Chat/Conversation.service';

class ProfileService {
  async get_by_id(id: number) {
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
        .where('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id')
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
      if (liked) {
        await conversationService.createConv(liker_id, liked_id);
      }
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
