import db from './database';
import userService from '../UserAccount/UserAccount.service';
import profileService from '../Profile/Profile.service';
import { Gender } from '../Types/Profile';

export const insertTestData = async () => {
  // await db('user_account').insert([
  //   { email: 'chaf@example.com', password: 'hashed_password_for_chaf' },
  //   { email: 'sawako@example.com', password: 'hashed_password_for_sawako' },
  //   { email: 'rico@example.com', password: 'hashed_password_for_rico' },
  //   { email: 'yurisa@example.com', password: 'hashed_password_for_yurisa' },
  // ]);

  // // Insert into profile table
  // await db('profile').insert([
  //   { id: 1, name: 'Chaf', birth_date: '1998-09-15', gender: 'male' },
  //   { id: 2, name: 'Sawako', birth_date: '1993-08-20', gender: 'female' },
  //   { id: 3, name: 'Rico', birth_date: '1995-11-12', gender: 'male' },
  //   { id: 4, name: 'Yurisa', birth_date: '2001-04-03', gender: 'female' },
  // ]);

  // // Insert into likes table
  // await db('likes').insert([
  //   { liker_id: 1, liked_id: 2 },
  //   { liker_id: 1, liked_id: 3 },
  //   { liker_id: 3, liked_id: 4 },
  //   { liker_id: 4, liked_id: 3 },
  // ]);

  await userService.createTest([
    {
      email: 'johan.c@outlook.fr',
      password: 'mdpdefou',
      username: 'chakito',
      firstname: 'chakito',
      lastname: 'Papou',
      birth_date: '1996-09-15',
      gender: Gender.Male,
      bio: 'oeoe',
    },
    {
      email: 'richard@example.com',
      password: 'mdpdefou',
      username: 'riri',
      firstname: 'riri',
      lastname: 'Papillon',
      birth_date: '1998-09-15',
      gender: Gender.Male,
      bio: 'Im a giga chad',
    },
    {
      email: 'alice@example.com',
      password: 'mdpdefou',
      username: 'alice',
      firstname: 'alice',
      lastname: 'Merveille',
      birth_date: '1995-07-21',
      gender: Gender.Female,
      bio: 'Hello, I am Alice!',
    },
    {
      email: 'bob@example.com',
      password: 'mdpdefou',
      username: 'bob',
      firstname: 'Bob',
      lastname: 'Le Bricoleur',
      birth_date: '1989-04-03',
      gender: Gender.Male,
      bio: 'Bob here, nice to meet you!',
    },
    {
      email: 'charlie@example.com',
      password: 'mdpdefou',
      username: 'charlie',
      firstname: 'Charlie',
      lastname: 'Chaplin',
      birth_date: '1992-11-30',
      gender: Gender.Male,
      bio: 'Greetings from Charlie!',
    },
    {
      email: 'eve@example.com',
      password: 'mdpdefou',
      username: 'eve',
      firstname: 'eve',
      lastname: 'wall-e',
      birth_date: '2000-05-18',
      gender: Gender.Female,
      bio: 'Eve says hi!',
    },
    {
      email: 'dave@example.com',
      password: 'mdpdefou',
      username: 'dave',
      firstname: 'Dave',
      lastname: 'Dove',
      birth_date: '1985-02-10',
      gender: Gender.Male,
      bio: 'Dave reporting in!',
    },
    {
      email: 'grace@example.com',
      password: 'mdpdefou',
      username: 'grace',
      firstname: 'Grace',
      lastname: 'Hatoi',
      birth_date: '1993-08-27',
      gender: Gender.Female,
      bio: 'Grace sends her regards!',
    },
  ]);
  await profileService.like(1, 3);
  await profileService.like(3, 1);
};
