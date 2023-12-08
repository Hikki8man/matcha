import db from '../../../database/connection';
import notificationService from '../../../notification/notification.service';
import SocketService from '../../../socket.service';
import { NotificationType } from '../../../types/notification';
import { PhotoType } from '../../../types/photo';
import { ProfileView } from '../../../types/profile';
import profileService from '../profile.service';

class ViewService {
  public profileViewRepo = () => db<ProfileView>('profile_view');

  async getProfileViews(user_id: number) {
    return profileService
      .profileRepo()
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
      const viewer = await profileService.profileNameAndAvatar(viewer_id);
      if (viewer) {
        SocketService.sendProfileView(viewed_id, {
          ...viewer,
          created_at: profile_view.created_at,
        });
        await notificationService.createNotification(
          viewer,
          viewed_id,
          NotificationType.View,
        );
      }
    }
  }
}

export default new ViewService();
