import {
  CompletedSteps,
  Gender,
  Profile,
  SexualOrientation,
} from '../../types/profile';
import db from '../../database/connection';
import { Tag } from '../../types/tag';
import { Filter, OrderBy } from '../../types/filter';
import blockService from './block/block.service';
import { PhotoType } from '../../types/photo';
import emailerService from '../../emailer/emailer.service';
import { env } from 'process';

class ProfileService {
  public profileRepo = () => db<Profile>('profile');

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
        .leftJoin('photo as photos', function () {
          this.on('profile.id', '=', 'photos.user_id').andOn(
            db.raw('photos.photo_type != ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .where('profile.id', id)
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
        .leftJoin('photo as photos', function () {
          this.on('profile.id', '=', 'photos.user_id').andOn(
            db.raw('photos.photo_type != ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .leftJoin('profile_tags as p_tags', 'profile.id', 'p_tags.profile_id')
        .leftJoin('tags as tags', 'p_tags.tag_id', 'tags.id')
        .where('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id', 'avatar')
        .first();
    } catch (e: any) {
      console.error('Error', e.message);
      return undefined;
    }
  }

  async profileNameAndAvatar(id: number) {
    try {
      return await this.profileRepo()
        .select('profile.id', 'profile.name', 'avatar.path as avatar')
        .leftJoin('photo as avatar', function () {
          this.on('profile.id', '=', 'avatar.user_id').andOn(
            db.raw('avatar.photo_type = ?', [PhotoType.Avatar]),
          );
        })
        .leftJoin('account as acc', 'profile.id', 'acc.id')
        .where('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id', 'avatar')
        .first();
    } catch (e: any) {
      console.error('Error', e.message);
      return undefined;
    }
  }

  private getOrientationAndGenderToMatch(
    sexual_orientation: SexualOrientation,
    gender: Gender,
  ) {
    let orientation: SexualOrientation[] = [];
    let gender_to_match: Gender[] = [];

    if (gender === Gender.Other) {
      orientation.push(SexualOrientation.Bisexual);
      gender_to_match.push(Gender.Male, Gender.Female, Gender.Other);
      return { orientation, gender_to_match };
    }

    switch (sexual_orientation) {
      case SexualOrientation.Heterosexual:
        orientation.push(
          SexualOrientation.Heterosexual,
          SexualOrientation.Bisexual,
        );
        gender_to_match.push(
          gender === Gender.Male ? Gender.Female : Gender.Male,
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
        gender_to_match.push(Gender.Male, Gender.Female, Gender.Other);
        break;
    }
    return { orientation, gender_to_match };
  }

  async get_all_filtered(id: number, filter: Filter) {
    const common_tags = filter.common_tags.map((tag) => tag.id);
    try {
      const my_profile = await this.get_by_id(id);
      const blocked_list = await blockService.getBlockedList(id);
      const blocked_ids = blocked_list.map((item) => item.blocked_id);
      const my_tags = my_profile.tags.map((tag: Tag) => tag.id);
      const { orientation, gender_to_match } =
        this.getOrientationAndGenderToMatch(
          my_profile.sexual_orientation,
          my_profile.gender,
        );

      const profilesQuery = this.profileRepo()
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
        .whereNotIn('profile.id', blocked_ids)
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

      const count = await profilesQuery.clone().groupBy('profile.id').count();

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

      const profiles = await profilesQuery
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
        .groupBy('profile.id', 'avatar')
        .offset(filter.offset)
        .limit(10, { skipBinding: true });
      return { profiles, count: count.length, limit: 10 };
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

  async report(user_id: number, reported_id: number, reason: string) {
    const reported_profile = await this.profileNameAndAvatar(reported_id);
    if (!reported_profile) {
      throw new Error('User not found');
    }
    const user_profile = await this.profileNameAndAvatar(user_id);
    if (!user_profile) {
      throw new Error('User not found');
    }
    const user_link = `${env.FRONT_URL}/profile/${user_id}`;
    const reported_link = `${env.FRONT_URL}/profile/${reported_id}`;
    const message = `
      <p>User <a href="${user_link}">${user_profile.name}</a> reported user <a href="${reported_link}">${reported_profile.name}</a></p>
      <p>Reason: ${reason}</p>
    `;

    await emailerService.sendMail({
      from: env.EMAIL,
      to: env.EMAIL,
      subject: 'Matcha: Report',
      html: message,
    });
  }
}

export default new ProfileService();
