import profileService from '../user/profile/profile.service';
import { Gender, SexualOrientation } from '../types/profile';
import DbService from './db.service';

export const initDb = async () => {
  const dbService = new DbService();

  await dbService.insertTags();
  await dbService.insertFakeUser({
    email: 'johan.c@outlook.fr',
    password: 'mdpdefou',
    username: 'chakito',
    firstname: 'chakito',
    lastname: 'Papou',
    birth_date: new Date('1996-09-15'),
    gender: Gender.Male,
    sexual_orientation: SexualOrientation.Heterosexual,
    bio: 'HALLOOO',
  });
  await dbService.createFakeUsers(40);
  await profileService.like(1, 3);
  await profileService.like(3, 1);
  await profileService.like(1, 6);
  await profileService.like(6, 1);
};
