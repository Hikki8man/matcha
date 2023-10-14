export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum CompletedSteps {
  Name = "name",
  Gender = "gender",
  Photo = "photo",
  Bio = "bio",
  Completed = "completed",
}

export interface Profile {
  user_id: number;
  name: string;
  birth_date: Date;
  gender: Gender;
  completed_steps: CompletedSteps;
}
