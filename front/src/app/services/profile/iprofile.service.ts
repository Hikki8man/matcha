import { GenderEnum } from 'src/app/enums/gender-enum';
import { Tag } from 'src/app/models/profile.model';

export abstract class IProfileService {
    public abstract editName(name: string): Promise<void>;
    public abstract editBio(bio: string): Promise<void>;
    public abstract editGender(gender: GenderEnum): Promise<void>;
    public abstract editAvatar(photo: any): Promise<void>;
    public abstract getAvatar(id: number): Promise<string>;
    public abstract getAllTags(): Promise<Tag[]>;
    public abstract editTags(tags: Tag[]): Promise<void>;
}
