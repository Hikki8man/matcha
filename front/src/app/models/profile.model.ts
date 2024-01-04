import { GenderEnum } from '../enums/gender-enum';
import { SexualOrientation } from '../enums/sexual-orientation-enum';
import { AboutModel } from './about.model';

export enum CompletedSteps {
    First,
    Second,
    Third,
    Completed,
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
    photos: { path: string; type: string }[];
    avatar: string;
    completed_steps: CompletedSteps;
}

export class PublicProfileModel {
    id: number;
    name: string;
    age: number;
    bio: string;
    tags: Tag[];
    gender: GenderEnum;
    sexual_orientation: SexualOrientation;
    country: string;
    city: string;
    distance: number;
    online: boolean;
    last_online?: Date;
    photos: { path: string; type: string }[];
    avatar: string;
    fameRating: number;
    from: string;
    job: string;
    studies: string;
    languages: string;
    smoking: string;
    drinking: string;
    drugs: string;
}

export interface ProfileCardModel {
    profile: PublicProfileModel;
    about: AboutModel;
    liked: boolean;
    likedYou: boolean;
}

export interface SearchResultModel {
    profiles: PublicProfileModel[];
    count: number;
    limit: number;
}
