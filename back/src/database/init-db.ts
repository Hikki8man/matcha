import { Gender, SexualOrientation } from '../types/profile';
import DbService from './db.service';
import likeService from '../user/profile/like/like.service';

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
    sexual_orientation: SexualOrientation.Bisexual,
    bio: 'HALLOOO',
  });

  await dbService.insertFakeUser({
    email: 'loic@example.com',
    password: 'mdpdefou',
    username: 'sltclolo',
    firstname: 'lolo',
    lastname: 'olol',
    birth_date: new Date('2000-09-15'),
    gender: Gender.Male,
    sexual_orientation: SexualOrientation.Bisexual,
    bio: 'Oe c moi',
  });
  await dbService.createFakeUsers(500);
  await likeService.like(1, 3);
  await likeService.like(3, 1);
  await likeService.like(1, 6);
  await likeService.like(6, 1);
};
