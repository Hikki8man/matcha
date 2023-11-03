import { CompletedSteps, Gender, Profile } from '../Types/Profile';
import { Tag } from '../Types/Tag';
import { UserAccount } from '../Types/UserAccount';
import db from './connection';
import bcrypt from 'bcrypt';
import tagsService from '../Tags/tags.service';

const NB_OF_TAGS = 50;
const MAX_TAG_PER_USER = 10;

interface testUser {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  birth_date: string;
  gender: Gender;
  bio: string;
}

class DbService {
  private saltRounds = 10;
  private interestTags = [
    { name: 'Cooking' },
    { name: 'Travel' },
    { name: 'Photography' },
    { name: 'Hiking' },
    { name: 'Painting' },
    { name: 'Gaming' },
    { name: 'Reading' },
    { name: 'Yoga' },
    { name: 'Music' },
    { name: 'Gardening' },
    { name: 'Fitness' },
    { name: 'Movies' },
    { name: 'Dancing' },
    { name: 'Sports' },
    { name: 'Technology' },
    { name: 'Fashion' },
    { name: 'Foodie' },
    { name: 'Pets' },
    { name: 'Meditation' },
    { name: 'Writing' },
    { name: 'Volunteering' },
    { name: 'Astronomy' },
    { name: 'History' },
    { name: 'Woodworking' },
    { name: 'Art' },
    { name: 'Nature' },
    { name: 'Science' },
    { name: 'Crafting' },
    { name: 'Camping' },
    { name: 'DIY' },
    { name: 'Languages' },
    { name: 'Surfing' },
    { name: 'Fishing' },
    { name: 'Wine Tasting' },
    { name: 'Coffee' },
    { name: 'Running' },
    { name: 'Skiing' },
    { name: 'Snowboarding' },
    { name: 'Philosophy' },
    { name: 'Comedy' },
    { name: 'Health' },
    { name: 'Architecture' },
    { name: 'Board Games' },
    { name: 'Anime' },
    { name: 'Biking' },
    { name: 'Fashion Design' },
    { name: 'Traveling' },
    { name: 'Collecting' },
    { name: 'Film' },
    { name: 'Vintage' },
  ];

  async insertTags() {
    await db('tags').insert(this.interestTags);
  }

  async createTest(bodys: testUser[]) {
    const profiles: Profile[] = [];
    for (const body of bodys) {
      console.log('inserting ' + body.firstname);

      const hash = await bcrypt.hash(body.password, this.saltRounds);
      try {
        const [user_account] = await db<UserAccount>('user_account').insert(
          {
            email: body.email,
            username: body.username,
            firstname: body.firstname,
            lastname: body.lastname,
            password: hash,
            verified: true,
          },
          ['*'],
        );
        // Insert user's profile information into the 'PROFILE' table
        const [profile] = await db<Profile>('profile')
          .insert({
            id: user_account.id,
            name: body.firstname,
            birth_date: new Date(body.birth_date),
            gender: body.gender,
            completed_steps: CompletedSteps.Name,
            bio: body.bio,
          })
          .returning('*');
        profiles.push(profile);
      } catch (e: any) {
        // console.log(e.message);
      }
    }
    return profiles;
  }

  async addRandomTagsToProfiles(profiles: Profile[]) {
    const tags = await db<Tag>('tags');
    for (const profile of profiles) {
      const tagsToInsert: Tag[] = [];
      const nb_of_tags = Math.floor(Math.random() * MAX_TAG_PER_USER + 1);
      const availableTags = [...tags];

      for (let i = 0; i < nb_of_tags; i++) {
        // Generate a random index to select a tag
        const randomIndex = Math.floor(Math.random() * availableTags.length);

        // Add the selected tag to the profile's tags array
        tagsToInsert.push(availableTags.splice(randomIndex, 1)[0]);
      }
      await tagsService.add(profile.id, tagsToInsert);
    }
  }
}

export default DbService;
