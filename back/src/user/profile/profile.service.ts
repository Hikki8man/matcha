import {
  CompletedSteps,
  Gender,
  Like,
  LikeEvent,
  LikeType,
  Profile,
  ProfileView,
  SexualOrientation,
} from '../../types/profile';
import db from '../../database/connection';
import conversationService from '../../chat/conversation.service';
import SocketService from '../../socket.service';
import { Tag } from '../../types/tag';
import { Filter, OrderBy } from '../../types/filter';
import blockService from './block/block.service';
import { PhotoType } from '../../types/photo';

class ProfileService {
  public profileRepo = () => db<Profile>('profile');
  public likeRepo = () => db<Like>('likes');
  public profileViewRepo = () => db<ProfileView>('profile_view');

  //todo remove?
  async get_by_id(id: number) {
    try {
      return await this.profileRepo()
        .select(
          'profile.*',
          'avatar.path as avatar',
          db.raw(`
        CASE
          WHEN COUNT(DISTINCT photos.id) = 0 THEN '[]'::jsonb
          ELSE jsonb_agg(DISTINCT jsonb_build_object('path', photos.path, 'type', photos.photo_type))
        END as photos
      `),
          db.raw(`
        CASE
          WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
          ELSE jsonb_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name))
        END as tags
      `),
          db.raw(`
          EXTRACT(YEAR FROM AGE(NOW(), profile.birth_date))::INTEGER as age
      `),
        )
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .leftJoin('photo as photos', 'profile.id', 'photos.user_id')
        .leftJoin('photo as avatar', 'profile.id', 'avatar.user_id')
        .where('profile.id', id)
        .andWhere('avatar.photo_type', PhotoType.Avatar)
        .andWhereNot('photos.photo_type', PhotoType.Avatar)
        .andWhere('acc.verified', true)
        .groupBy('profile.id', 'avatar')
        .first();
    } catch (e: any) {
      console.log('Error', e.message);
      return undefined;
    }
  }
  async profileCardById(id: number) {
    try {
      return await this.profileRepo()
        .select(
          'profile.id',
          'profile.name',
          'profile.bio',
          'profile.gender',
          'profile.sexual_orientation',
          'profile.country',
          'profile.city',
          'profile.online',
          'profile.last_online',
          'avatar.path as avatar',
          db.raw(`
            CASE
              WHEN COUNT(DISTINCT photos.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(DISTINCT jsonb_build_object('path', photos.path, 'type', photos.photo_type))
            END as photos
          `),
          db.raw(`
            CASE
              WHEN COUNT(tags.id) = 0 THEN '[]'::jsonb
              ELSE jsonb_agg(DISTINCT jsonb_build_object('id', tags.id, 'name', tags.name))
            END as tags
          `),
          db.raw(`
              EXTRACT(YEAR FROM AGE(NOW(), profile.birth_date))::INTEGER as age
          `),
        )
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .leftJoin('photo as photos', 'profile.id', 'photos.user_id')
        .leftJoin('photo as avatar', 'profile.id', 'avatar.user_id')
        .where('profile.id', id)
        .andWhere('avatar.photo_type', PhotoType.Avatar)
        .andWhereNot('photos.photo_type', PhotoType.Avatar)
        .andWhere('acc.verified', true)
        .groupBy('profile.id', 'avatar')
        .first();
    } catch (e: any) {
      console.error('Error', e.message);
      return undefined;
    }
  }

  //TODO remove
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

      const blocked_list = blockService
        .blockRepo()
        .select('blocked_id')
        .where('blocker_id', id);

      const my_tags = my_profile.tags.map((tag: Tag) => tag.id);
      const { orientation, gender_to_match } =
        this.getOrientationAndGenderToMatch(
          my_profile.sexual_orientation,
          my_profile.gender,
        );

      const profilesQuery = this.profileRepo()
        .select(
          'profile.id',
          'profile.name',
          'profile.bio',
          'profile.gender',
          'profile.sexual_orientation',
          'profile.country',
          'profile.city',
          'profile.online',
          'profile.last_online',
        )
        .select('avatar.path as avatar')
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
          db.raw(`
              EXTRACT(YEAR FROM AGE(NOW(), profile.birth_date))::INTEGER as age
          `),
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
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags', 'profile.id', 'profile_tags.profile_id')
        .leftJoin('tags', 'profile_tags.tag_id', 'tags.id')
        .whereIn('profile.gender', gender_to_match)
        .whereIn('profile.sexual_orientation', orientation)
        .whereNotIn('profile.id', blocked_list)
        .andWhereNot('profile.id', id)
        .andWhere('acc.verified', true)
        .andWhere('profile.completed_steps', CompletedSteps.Completed)
        .andHaving(
          db.raw('EXTRACT(YEAR FROM AGE(NOW(), profile.birth_date)) >= ?', [
            filter.min_age,
          ]),
        );
      if (filter.max_dist < 1000) {
        profilesQuery.andWhereRaw(
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
      }

      if (filter.max_age < 60) {
        profilesQuery.andHaving(
          db.raw('EXTRACT(YEAR FROM AGE(NOW(), profile.birth_date)) <= ?', [
            filter.max_age,
          ]),
        );
      }

      if (common_tags.length > 0) {
        profilesQuery.havingRaw(
          'COUNT(CASE WHEN profile_tags.tag_id = ANY(?) THEN profile_tags.tag_id END) > 0',
          [common_tags],
        );
      }

      switch (filter.order_by) {
        case OrderBy.Oldest:
          profilesQuery.orderBy('birth_date', 'asc');
          break;
        case OrderBy.Youngest:
          profilesQuery.orderBy('birth_date', 'desc');
          break;
        case OrderBy.CommonTags:
          profilesQuery.orderBy('matching_tags_count', 'desc');
          break;
        default:
          profilesQuery.orderBy('distance', 'asc');
      }

      return await profilesQuery
        .groupBy('profile.id', 'avatar')
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

  async like(
    liker_id: number,
    liked_id: number,
  ): Promise<LikeEvent | undefined> {
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
      const liker_user = await this.profileRepo()
        .select('profile.name', 'profile.id')
        .select('avatar.path as avatar')
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .where('profile.id', liker_id)
        .first();
      if (liker_user) {
        const user = { ...liker_user, created_at: like.created_at };
        return { user, type: LikeType.Like };
      }
      return undefined;
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
      return { user: { id: liker_id }, type: LikeType.Unlike };
    }
  }

  async getLikerList(id: number) {
    try {
      return await this.profileRepo()
        .select('profile.id', 'profile.name', 'likes.created_at')
        .select('avatar.path as avatar')
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('likes', 'profile.id', 'likes.liker_id')
        .where('likes.liked_id', id);
    } catch (e) {
      return [];
    }
  }

  async isLiked(user_id: number, liked_id: number): Promise<boolean> {
    const isLiked = await this.likeRepo()
      .select('id')
      .where('liker_id', user_id)
      .andWhere('liked_id', liked_id)
      .first();

    return isLiked ? true : false;
  }

  async getProfileViews(user_id: number) {
    return this.profileRepo()
      .select('profile.id', 'profile.name', 'profile_view.created_at')
      .select('avatar.path as avatar')
      .leftJoin('photo as avatar', function () {
        this.on('profile.id', '=', 'avatar.user_id').andOn(
          db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
        );
      })
      .leftJoin('profile_view', 'profile.id', 'profile_view.viewer_id')
      .where('profile_view.viewed_id', user_id);
  }

  async addProfileView(viewer_id: number, viewed_id: number) {
    const [profile_view] = await this.profileViewRepo()
      .insert({ viewed_id, viewer_id })
      .onConflict(['viewed_id', 'viewer_id'])
      .ignore()
      .returning('*');

    if (profile_view) {
      const profile = await this.profileRepo()
        .select('profile.id', 'profile.name')
        .select('avatar.path as avatar')
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .where('profile.id', viewer_id)
        .first();
      if (profile) {
        SocketService.sendProfileView(viewed_id, {
          ...profile,
          created_at: profile_view.created_at,
        });
      }
    }
  }

  async isProfileComplete(user_id: number) {
    try {
      const profile = await this.profileRepo()
        .select('id')
        .where('id', user_id)
        .andWhere('completed_steps', CompletedSteps.Completed)
        .first();
      return profile ? true : false;
    } catch (e) {
      return false;
    }
  }
}

export default new ProfileService();
