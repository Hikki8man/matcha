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

export interface ProfileData {
    id: number;
    name: string;
    birth_date: Date;
    gender: Gender;
    completed_steps: CompletedSteps;
}

export class Profile {
    id: number;
    name: string;
    age: number;
    gender: Gender;
    completed_steps: CompletedSteps;

    constructor(data: ProfileData) {
        this.id = data.id;
        this.name = data.name;
        this.gender = data.gender;
        this.completed_steps = data.completed_steps;
        this.age = new Date().getFullYear() - new Date(data.birth_date).getFullYear();
    }
}
