import { GenderEnum } from '../enums/gender-enum';

export enum CompletedSteps {
    Name = 'name',
    Gender = 'gender',
    Photo = 'photo',
    Tags = 'tags',
    Bio = 'bio',
    Completed = 'completed',
}

export interface Tag {
    id: number;
    name: string;
}

export interface ProfileModel {
    id: number;
    name: string;
    birth_date: Date;
    bio: string;
    gender: GenderEnum;
    tags: Tag[];
    completed_steps: CompletedSteps;
}
