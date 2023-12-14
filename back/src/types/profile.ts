export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum SexualOrientation {
  Heterosexual = 'heterosexual',
  Homosexual = 'homosexual',
  Bisexual = 'bisexual',
}

// export enum CompletedSteps {
//   Name = 'name',
//   Gender = 'gender',
//   SexualOrientation = 'sexual_orientation',
//   Photo = 'photo',
//   Tags = 'tags',
//   Bio = 'bio',
//   Location = 'location',
//   Completed = 'completed',
// }

export enum CompletedSteps {
  first,
  second,
  third,
  completed,
}

export interface Profile {
  id: number;
  name: string;
  birth_date: Date;
  bio: string;
  gender: Gender;
  sexual_orientation: SexualOrientation;
  completed_steps: CompletedSteps;
  online: boolean;
  last_online: Date;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ProfileMinimum {
  id: number;
  name: string;
  avatar: string;
}

export interface Like {
  id: number;
  liker_id: number;
  liked_id: number;
  created_at: Date;
}

export enum LikeType {
  Like,
  Unlike,
}
export interface LikeEvent {
  user: { id: number; name?: string; created_at?: Date };
  type: LikeType;
}

export interface ProfileView {
  viewer_id: number;
  viewed_id: number;
  created_at: Date;
}
export interface ProfileViewEvent {
  id: number;
  name: string;
  created_at: Date;
}
