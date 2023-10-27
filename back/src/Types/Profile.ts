export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum CompletedSteps {
  Name = 'name',
  Gender = 'gender',
  Photo = 'photo',
  Bio = 'bio',
  Completed = 'completed',
}

export interface Profile {
  id: number;
  name: string;
  birth_date: Date;
  bio: string;
  gender: Gender;
  completed_steps: CompletedSteps;
}

export interface Like {
  id: number;
  liker_id: number;
  liked_id: number;
  created_at: Date;
}
