import {
  Gender,
  CompletedSteps,
  SexualOrientation,
} from '../../../types/profile';
import { Location } from '../../../types/location';
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
  async editSexualOrientation(id: number, orientation: SexualOrientation) {
    try {
      return await profileService
        .profileRepo()
        .update({ sexual_orientation: orientation })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }

  async updateCompletedSteps(id: number, step: CompletedSteps) {
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

  async editLocation(id: number, location: Location) {
    try {
      return await profileService
        .profileRepo()
        .update({
          city: location.city,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
        })
        .where('id', id);
    } catch (e: any) {
      console.log('error updating name', e.message);
      return undefined;
    }
  }
}

export default new EditProfileService();
