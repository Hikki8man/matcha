import {
  CompletedSteps,
  Gender,
  Profile,
  SexualOrientation,
} from '../types/profile';
import { Tag } from '../types/tag';
import db from './connection';
import bcrypt from 'bcrypt';
import tagsService from '../tags/tags.service';
import { Photo, PhotoType } from '../types/photo';
import accountService from '../user/account/account.service';
import { female_names } from './fake-user-data/female-names';
import { male_names } from './fake-user-data/male-names';
import { last_names } from './fake-user-data/last-names';
import { interestTags } from './interest-tags';
import { locations } from './fake-user-data/locations';
import { About } from '../types/about';
import { jobs } from './fake-user-data/jobs';
import { studies } from './fake-user-data/studies';
import { spokenLanguages } from './fake-user-data/languages';
import { bioFemale, bioMale } from './fake-user-data/bio';
import likeService from '../user/profile/like/like.service';
import { profile } from 'console';
import profileService from '../user/profile/profile.service';

const MAX_TAG_PER_USER = 5;
const PHOTO_DATASET_NB = 3000;

interface FakeUser {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  birth_date: Date;
  gender: Gender;
  sexual_orientation: SexualOrientation;
  bio: string;
}

class DbService {
  private saltRounds = 10;

  async insertTags() {
    await db('tags').insert(interestTags);
  }

  private getRandomDate() {
    const startDate = new Date('1980-01-01');
    const endDate = new Date('2004-12-31');
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp =
      startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    const randomDate = new Date(randomTimestamp);
    return randomDate;
  }

  private getRandomLocation() {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  }

  private getRandomJob() {
    const randomIndex = Math.floor(Math.random() * jobs.length);
    return jobs[randomIndex];
  }

  private getRandomStudie() {
    const randomIndex = Math.floor(Math.random() * studies.length);
    return studies[randomIndex];
  }

  private getRandomChoice() {
    const choice = ['Oui', 'Occasionnellement', 'Souvent', 'Non'];
    const randomIndex = Math.floor(Math.random() * choice.length);
    return choice[randomIndex];
  }

  private getRandomBio(gender: Gender) {
    if (gender === Gender.Female) {
      const randomIndex = Math.floor(Math.random() * bioFemale.length);
      return bioFemale[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * bioMale.length);
      return bioMale[randomIndex];
    }
  }

  private getRandomLanguages() {
    const randomNb = Math.floor(Math.random() * 3 + 1);
    let languages = '';
    for (let i = 0; i < randomNb; ++i) {
      const randomIndex = Math.floor(Math.random() * spokenLanguages.length);
      languages += spokenLanguages[randomIndex];
      if (i !== randomNb - 1) {
        languages += ', ';
      }
    }
    return languages;
  }

  async insertFakeUser(user: FakeUser) {
    try {
      const hash = await bcrypt.hash(user.password, this.saltRounds);
      const [account] = await accountService.accountRepo().insert(
        {
          email: user.email,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          password: hash,
          verified: true,
        },
        ['*'],
      );

      const location = this.getRandomLocation();
      const [profile] = await db<Profile>('profile')
        .insert({
          id: account.id,
          name: user.firstname,
          birth_date: user.birth_date,
          gender: user.gender,
          sexual_orientation: user.sexual_orientation,
          completed_steps: CompletedSteps.Completed,
          country: location.country,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          bio: user.bio,
        })
        .returning('*');
      await this.insertAboutInfo(profile.id);
      await this.addRandomTagsToProfile(profile.id);
      await this.addProfileAvatar(profile.id, profile.gender);
      await this.addProfilePhotos(profile.id);
    } catch {}
  }

  private async insertAboutInfo(id: number) {
    const from = this.getRandomLocation().city;
    const job = this.getRandomJob();
    const studies = this.getRandomStudie();
    const languages = this.getRandomLanguages();
    const smoking = this.getRandomChoice();
    const drinking = this.getRandomChoice();
    const drugs = this.getRandomChoice();

    await db<About>('about').insert({
      id,
      from,
      job,
      studies,
      languages,
      smoking,
      drinking,
      drugs,
    });
  }

  private getRandomNameAndGender() {
    let gender: Gender;
    let firstname: string;
    const coin = Math.floor(Math.random() * 2);

    if (coin === 0) {
      gender = Gender.Female;
      const randomIndex = Math.floor(Math.random() * female_names.length);
      firstname = female_names[randomIndex];
    } else {
      gender = Gender.Male;
      const randomIndex = Math.floor(Math.random() * male_names.length);
      firstname = male_names[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * last_names.length);
    const lastname = last_names[randomIndex];
    return { firstname, lastname, gender };
  }

  private getRandomSexualOrientation() {
    const randomOrientation = Math.floor(Math.random() * 3);
    if (randomOrientation === 0) {
      return SexualOrientation.Heterosexual;
    } else if (randomOrientation === 1) {
      return SexualOrientation.Bisexual;
    } else {
      return SexualOrientation.Homosexual;
    }
  }

  private getUsernameAndEmail(firstname: string, lastname: string) {
    const randomNumber = Math.floor(Math.random() * 7000);
    const username = firstname + randomNumber;
    const email = firstname + '.' + lastname + randomNumber + '@example.com';
    return { username, email };
  }

  private getRandomId(nb_of_users: number, user_id: number): number {
    const randomId = Math.floor(Math.random() * nb_of_users) + 1;
    if (randomId === user_id) {
      return this.getRandomId(nb_of_users, user_id);
    }
    return randomId;
  }

  async createFakeUsers(nb: number) {
    console.log(nb + ' FAKE USER ARE BEING CREATED...');
    for (let i = 0; i < nb; ++i) {
      const { firstname, lastname, gender } = this.getRandomNameAndGender();
      const sexual_orientation = this.getRandomSexualOrientation();
      const { username, email } = this.getUsernameAndEmail(firstname, lastname);
      const birth_date = this.getRandomDate();
      const password = 'password';
      const bio = this.getRandomBio(gender);
      await this.insertFakeUser({
        username,
        firstname,
        lastname,
        email,
        password,
        bio,
        birth_date,
        sexual_orientation,
        gender,
      });
      console.log('CREATING FAKE USERS ', ((i + 1) * 100) / nb + '%');
    }
    console.log(nb + ' FAKE USER CREATED');
    for (let i = 0; i < nb; ++i) {
      const nb_to_like = Math.floor(Math.random() * (nb / 25));
      for (let j = 0; j < nb_to_like; ++j) {
        const random_id = this.getRandomId(nb, i + 1);
        await likeService.like(i + 1, random_id);
      }
      console.log('GENERATING RANDOM LIKES ', ((i + 1) * 100) / nb + '%');
    }
    console.log('FINISHED LIKING');
    for (let i = 0; i < nb; ++i) {
      await profileService.updateFameRating(i + 1);
    }
  }

  private async addRandomTagsToProfile(id: number) {
    const tags = await db<Tag>('tags');
    const tagsToInsert: Tag[] = [];
    const nb_of_tags = Math.floor(Math.random() * MAX_TAG_PER_USER + 1);
    const availableTags = [...tags];

    for (let i = 0; i < nb_of_tags; i++) {
      const randomIndex = Math.floor(Math.random() * availableTags.length);
      tagsToInsert.push(availableTags.splice(randomIndex, 1)[0]);
    }
    await tagsService.editTags(id, tagsToInsert);
  }

  private async addProfileAvatar(id: number, gender: Gender) {
    const filePath = 'public/';
    let filename;
    if (gender === Gender.Female) {
      const randomIndex = Math.floor(Math.random() * 20 + 1);
      filename = `female${randomIndex}.png`;
    } else {
      const randomIndex = Math.floor(Math.random() * 20 + 1);
      filename = `male${randomIndex}.png`;
    }
    await db<Photo>('photo').insert({
      user_id: id,
      filename: filename,
      path: filePath + filename,
      content_type: 'image/png',
      photo_type: PhotoType.Avatar,
    });
  }

  private async addProfilePhotos(id: number) {
    const filePath = 'public/';
    const nb_of_photos = Math.floor(Math.random() * 4 + 1);
    for (let i = 0; i < nb_of_photos; ++i) {
      const random_index = Math.floor(Math.random() * PHOTO_DATASET_NB + 1);
      const filename = `photo_${random_index}.jpg`;
      const type = `photo_${i + 1}`;
      await db<Photo>('photo').insert({
        user_id: id,
        filename: filename,
        path: filePath + filename,
        content_type: 'image/jpg',
        photo_type: type as PhotoType,
      });
    }
  }
}

export default DbService;
