import { Observable } from 'rxjs';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { ProfileModel, Tag } from 'src/app/models/profile.model';

export abstract class ICompleteProfileService {
    public abstract completeName(name: string): Observable<void>;
    public abstract completeGender(gender: GenderEnum): Observable<void>;
    public abstract completeAvatar(photo: any): Observable<void>;
    public abstract completeTags(tags: Tag[]): Observable<void>;
    public abstract completeBio(bio: string): Observable<void>;

    public abstract isProfileCompleteGuard(profile: ProfileModel | undefined): Observable<boolean>;
}
