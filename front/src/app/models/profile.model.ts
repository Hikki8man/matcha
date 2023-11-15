import { Observable } from 'rxjs';
import { GenderEnum } from '../enums/gender-enum';
import { SexualOrientation } from '../enums/sexual-orientation-enum';

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
    sexual_orientation: SexualOrientation;
    bio: string;
    gender: GenderEnum;
    tags: Tag[];
    completed_steps: CompletedSteps;
}

export interface PublicProfileModel {
    id: number;
    name: string;
    age: number;
    bio: string;
    // gender: GenderEnum;
    // tags: Tag[];
    avatar: Observable<string>;
}
