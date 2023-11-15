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

  toRadians(degree: number): number {
    // Math library in JavaScript/TypeScript
    // defines the constant
    // Math.PI as the value of
    // pi accurate to 15 digits
    const oneDeg: number = Math.PI / 180;
    return oneDeg * degree;
  }

  distance(lat1: number, long1: number, lat2: number, long2: number): number {
    // Convert the latitudes
    // and longitudes
    // from degree to radians.
    lat1 = this.toRadians(lat1);
    long1 = this.toRadians(long1);
    lat2 = this.toRadians(lat2);
    long2 = this.toRadians(long2);

    // Haversine Formula
    const dLong: number = long2 - long1;
    const dLat: number = lat2 - lat1;

    let ans: number =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLong / 2), 2);

    ans = 2 * Math.asin(Math.sqrt(ans));

    // Radius of Earth in
    // Kilometers, R = 6371
    // Use R = 3956 for miles
    const R: number = 6371;

    // Calculate the result
    ans = ans * R;

    return ans;
  }

  async get_all_filtered(id: number) {
    const offset = 0;
    const max_dist = 300;
    try {
      let orientation: SexualOrientation[] = [];
      let gender_to_match: Gender[] = [];
      const [my_profile] = await this.profileRepo()
        .select('gender', 'sexual_orientation', 'latitude', 'longitude')
        .where('id', id);
      if (my_profile.sexual_orientation === SexualOrientation.Heterosexual) {
        orientation.push(SexualOrientation.Heterosexual);
        orientation.push(SexualOrientation.Bisexual);
        if (my_profile.gender === Gender.Male) {
          gender_to_match.push(Gender.Female);
        } else if (my_profile.gender === Gender.Female) {
          gender_to_match.push(Gender.Male);
        } else {
          gender_to_match.push(Gender.Other);
        }
      } else if (
        my_profile.sexual_orientation === SexualOrientation.Homosexual
      ) {
        orientation.push(SexualOrientation.Homosexual);
        orientation.push(SexualOrientation.Bisexual);
        gender_to_match.push(my_profile.gender);
      } else {
        orientation.push(SexualOrientation.Bisexual);
        gender_to_match.push(Gender.Male);
        gender_to_match.push(Gender.Female);
      }
      console.log(
        'my gender:' + my_profile.gender + ' gender to match:',
        gender_to_match,
      );
      console.log(
        'my orientation ' +
          my_profile.sexual_orientation +
          ' orientation to match:',
        orientation,
      );
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
        .whereIn('profile.gender', gender_to_match)
        .whereIn('profile.sexual_orientation', orientation)
        .andWhereNot('profile.id', id)
        .andWhere('acc.verified', true)
        .groupBy('profile.id')
        .offset(offset)
        .limit(10, { skipBinding: true })
        .then((profiles: Profile[]) => {
          return profiles.filter((profile) => {
            const dist = this.distance(
              my_profile.latitude,
              my_profile.longitude,
              profile.latitude,
              profile.longitude,
            );
            console.log(
              'distance between me and ' + profile.name + ' : ' + dist,
            );
            if (dist <= max_dist) {
              return profile;
            }
          });
        });
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
