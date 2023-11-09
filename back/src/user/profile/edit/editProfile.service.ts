import { Gender, CompletedSteps } from '../../../types/profile';
import profileService from '../profile.service';

class EditProfileService {
  async editName(id: number, name: string) {
    try {
      return await profileService
        .profileRepo()
        .update({ name: name })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }

  async editBio(id: number, bio: string) {
    try {
      return await profileService
        .profileRepo()
        .update({ bio: bio })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating bio', e.message);
      return undefined;
    }
  }

  async editGender(id: number, gender: Gender) {
    try {
      return await profileService
        .profileRepo()
        .update({ gender: gender })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }

  async updateCompteteSteps(id: number, step: CompletedSteps) {
    try {
      return await profileService
        .profileRepo()
        .update({ completed_steps: step })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating steps', e.message);
      return undefined;
    }
  }
}

export default new EditProfileService();
