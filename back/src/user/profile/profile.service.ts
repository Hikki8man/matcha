import {
  CompletedSteps,
  Gender,
  Like,
  Profile,
  SexualOrientation,
} from '../../types/profile';
import HttpError from '../../utils/HttpError';
import db from '../../database/connection';
import conversationService from '../../chat/conversation.service';
import SocketService from '../../socket.service';
import { Tag } from '../../types/tag';
import { ProfileTag } from '../../types/profileTag';
import { Filter, OrderBy } from '../../types/filter';

class ProfileService {
  public profileRepo = () => db<Profile>('profile');
  public likeRepo = () => db<Like>('likes');

  async get_by_id(id: number) {
    try {
      return await this.profileRepo()
        .select('profile.*')
        // .select('photo.path as avatar_path')
        // .select(db.raw('MAX(photo.path) as photo_path'))alo
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        // .leftJoin('photo as photo', function () {
        //   this.on('profile.id', '=', 'photo.user_id').andOn(
        //     db.raw('photo.avatar = true'),
        //   );
        // })
        .where('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id' /*, 'photo.path'*/)
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }

  async get_all(id: number) {
    try {
      return await this.profileRepo()
        .select('profile.*')
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .leftJoin('account as acc', 'profile.id', 'acc.id')
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

  private getOrientationAndGenderToMatch(
    sexual_orientation: SexualOrientation,
    gender: Gender,
  ) {
    let orientation: SexualOrientation[] = [];
    let gender_to_match: Gender[] = [];

    switch (sexual_orientation) {
      case SexualOrientation.Heterosexual:
        orientation.push(
          SexualOrientation.Heterosexual,
          SexualOrientation.Bisexual,
        );
        gender_to_match.push(
          gender === Gender.Male
            ? Gender.Female
            : gender === Gender.Female
            ? Gender.Male
            : Gender.Other,
        );
        break;

      case SexualOrientation.Homosexual:
        orientation.push(
          SexualOrientation.Homosexual,
          SexualOrientation.Bisexual,
        );
        gender_to_match.push(gender);
        break;

      default:
        orientation.push(SexualOrientation.Bisexual);
        gender_to_match.push(Gender.Male, Gender.Female);
        break;
    }
    return { orientation, gender_to_match };
  }

  async get_all_filtered(id: number, filter: Filter) {
    const common_tags = filter.common_tags.map((tag) => tag.id);
    try {
      const my_profile = await this.profileRepo()
        .select('profile.*')
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .leftJoin('profile_tags', 'profile.id', 'profile_tags.profile_id')
        .leftJoin('tags', 'profile_tags.tag_id', 'tags.id')
        .where('profile.id', id)
        .groupBy('profile.id')
        .first();

      const my_tags = my_profile.tags.map((tag: Tag) => tag.id);
      const { orientation, gender_to_match } =
        this.getOrientationAndGenderToMatch(
          my_profile.sexual_orientation,
          my_profile.gender,
        );

      const profileQuery = this.profileRepo()
        .select('profile.*')
        .select(
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
        )
        .select(
          db.raw(
            `COUNT(CASE WHEN profile_tags.tag_id = ANY(?) THEN profile_tags.tag_id END) as matching_tags_count`,
            [my_tags],
          ),
        )
        .select(
          db.raw(
            `
            ROUND(
              ST_DistanceSphere(
                ST_MakePoint(?, ?),
                ST_MakePoint(profile.longitude, profile.latitude)
              ) / 1000
            )::INTEGER as distance
          `,
            [my_profile.longitude, my_profile.latitude],
          ),
        )
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags', 'profile.id', 'profile_tags.profile_id')
        .leftJoin('tags', 'profile_tags.tag_id', 'tags.id')
        .whereIn('profile.gender', gender_to_match)
        .whereIn('profile.sexual_orientation', orientation)
        .andWhereNot('profile.id', id)
        .andWhere('acc.verified', true)
        .andWhere('profile.completed_steps', CompletedSteps.Completed)
        .andWhereRaw(
          `
          ROUND(
            ST_DistanceSphere(
              ST_MakePoint(?, ?),
              ST_MakePoint(profile.longitude, profile.latitude)
            ) / 1000
          )::INTEGER <= ?
        `,
          [my_profile.longitude, my_profile.latitude, filter.max_dist],
        );

      if (common_tags.length > 0) {
        profileQuery.havingRaw(
          'COUNT(CASE WHEN profile_tags.tag_id = ANY(?) THEN profile_tags.tag_id END) > 0',
          [common_tags],
        );
      }

      switch (filter.order_by) {
        case OrderBy.AgeOlder:
          profileQuery.orderBy('birth_date', 'asc');
          break;
        case OrderBy.AgeYounger:
          profileQuery.orderBy('birth_date', 'desc');
          break;
        case OrderBy.CommonTags:
          profileQuery.orderBy('matching_tags_count', 'desc');
          break;
        default:
          profileQuery.orderBy('distance', 'asc');
      }

      return await profileQuery
        .groupBy('profile.id')
        .offset(filter.offset)
        .limit(10, { skipBinding: true });
    } catch (e: any) {
      console.log('error in getting all profile', e.message);
      return undefined;
    }
  }

  async setOnline(id: number) {
    try {
      return await this.profileRepo().update({ online: true }).where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }

  async setOffline(id: number) {
    try {
      return await this.profileRepo()
        .update({ online: false, last_online: db.fn.now() })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }

  async like(liker_id: number, liked_id: number) {
    if (liker_id == liked_id) return undefined;
    const existingLike: Like[] = await this.likeRepo()
      .select('*')
      .where({ liker_id, liked_id })
      .orWhere({ liker_id: liked_id, liked_id: liker_id });

    const hasLikedAlready: Like | undefined = existingLike.find(
      (like) => like.liker_id === liker_id,
    );
    const isLiked: Like | undefined = existingLike.find(
      (like) => like.liked_id === liker_id,
    );

    if (!hasLikedAlready) {
      const [like] = await this.likeRepo()
        .insert({
          liker_id,
          liked_id,
        })
        .returning('*');
      // if liked then Match
      if (isLiked) {
        const convCreated = await conversationService.createConv(
          liker_id,
          liked_id,
        );
        if (convCreated) {
          SocketService.sendMatch(convCreated);
        }
      }
      return like;
    } else {
      // unlike
      await this.likeRepo().del().where('id', hasLikedAlready.id);
      if (isLiked) {
        // if liked then Unmatch
        const convCreated = await conversationService.deleteConv(
          liker_id,
          liked_id,
        );
        if (convCreated) {
          console.log('conv', convCreated);
          SocketService.sendUnmatch(convCreated);
        }
      }
      return; //SUCCES unlike
    }
  }
}

export default new ProfileService();
