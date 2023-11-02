import { GenderEnum } from '../enums/gender-enum';

export enum CompletedSteps {
    Name = 'name',
    Gender = 'gender',
    Photo = 'photo',
    Bio = 'bio',
    Completed = 'completed',
}

export interface ProfileModel {
    id: number;
    name: string;
    birth_date: Date;
    bio: string;
    gender: GenderEnum;
    completed_steps: CompletedSteps;
}
