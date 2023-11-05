import { Observable } from 'rxjs';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { ProfileModel, Tag } from 'src/app/models/profile.model';

export abstract class ICompleteProfileService {
    public abstract completeName(name: string): Promise<void>;
    public abstract completeGender(gender: GenderEnum): Promise<void>;
    public abstract completeAvatar(photo: any): Promise<void>;
    public abstract completeTags(tags: Tag[]): Promise<void>;
    public abstract completeBio(bio: string): Promise<void>;

    public abstract isProfileCompleteGuard(profile: ProfileModel | undefined): Observable<boolean>;
}
