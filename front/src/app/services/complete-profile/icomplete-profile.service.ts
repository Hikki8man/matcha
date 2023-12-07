import { Observable } from 'rxjs';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { Tag } from 'src/app/models/profile.model';

export abstract class ICompleteProfileService {
    public abstract completeName(name: string): Observable<void>;
    public abstract completeGender(gender: GenderEnum): Observable<void>;
    public abstract completeSexualOrientation(orientation: SexualOrientation): Observable<void>;
    public abstract completeAvatar(photo: any): Observable<void>;
    public abstract completeTags(tags: Tag[]): Observable<void>;
    public abstract completeBio(bio: string): Observable<void>;

    public abstract isProfileCompleteGuard(): boolean;
    public abstract isProfileNotCompleteGuard(): boolean;
}
