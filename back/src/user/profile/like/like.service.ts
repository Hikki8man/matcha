import conversationService from '../../../chat/conversation.service';
import db from '../../../database/connection';
import notificationService from '../../../notification/notification.service';
import SocketService from '../../../socket.service';
import { ConversationLoaded } from '../../../types/chat';
import { NotificationType } from '../../../types/notification';
import { PhotoType } from '../../../types/photo';
import {
  Like,
  LikeEvent,
  LikeType,
  ProfileMinimum,
} from '../../../types/profile';
import HttpError from '../../../utils/HttpError';
import blockService from '../block/block.service';
import profileService from '../profile.service';

class LikeService {
  public likeRepo = () => db<Like>('likes');

  async insertLike(liker_id: number, liked_id: number) {
    const [like] = await this.likeRepo()
      .insert({
        liker_id,
        liked_id,
      })
      .returning('*');
    return like;
  }

  async deleteLike(id: number) {
    await this.likeRepo().where('id', id).del();
  }

  async deleteLikeByUsersId(liker_id: number, liked_id: number) {
    await this.likeRepo()
      .where('liker_id', liker_id)
      .andWhere('liked_id', liked_id)
      .del();
  }

  async getLikerList(id: number) {
    try {
      return await profileService
        .profileRepo()
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

  async like(
    liker_id: number,
    liked_id: number,
  ): Promise<LikeEvent | undefined> {
    if (liker_id == liked_id) return undefined;

    const liker: ProfileMinimum =
      await profileService.profileNameAndAvatar(liker_id);
    const liked: ProfileMinimum =
      await profileService.profileNameAndAvatar(liked_id);

    if (!liker || !liked) {
      throw new HttpError(400, 'User not found');
    }
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
      if (await blockService.isBlocked(liked_id, liker_id)) {
        return;
      }
      const like = await this.insertLike(liker_id, liked_id);
      // if liked then Match
      if (isLiked) {
        const convCreated = await conversationService.createConv(
          liker_id,
          liked_id,
        );
        if (convCreated) {
          const conversation: ConversationLoaded = {
            id: convCreated.id,
            user_1: liker,
            user_2: liked,
          };
          SocketService.sendMatch(conversation);
          await notificationService.createNotification(
            liker,
            liked_id,
            NotificationType.Match,
          );
        }
      } else {
        await notificationService.createNotification(
          liker,
          liked_id,
          NotificationType.Like,
        );
      }
      const user = { ...liker, created_at: like.created_at };
      return { user, type: LikeType.Like };
    } else {
      // unlike
      await this.deleteLike(hasLikedAlready.id);
      if (isLiked) {
        await this.unMatch(liker, liked.id);
      }
      return { user: liker, type: LikeType.Unlike };
    }
  }

  async unMatch(liker: ProfileMinimum, liked_id: number) {
    const convDelete = await conversationService.deleteConv(liker.id, liked_id);
    if (convDelete) {
      SocketService.sendUnmatch(convDelete);
      await notificationService.createNotification(
        liker,
        liked_id,
        NotificationType.unMatch,
      );
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
}

export default new LikeService();
