import { Observable } from 'rxjs';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { FiltersModel } from 'src/app/models/filters.model';
import { LikeModel } from 'src/app/models/like.model';
import { LocationModel } from 'src/app/models/location.model';
import { ProfileViewModel } from 'src/app/models/profile-view.model';
import { ProfileCardModel, SearchResultModel, Tag } from 'src/app/models/profile.model';

export abstract class IProfileService {
    public abstract editName(name: string): Observable<void>;
    public abstract editBio(bio: string): Observable<void>;
    public abstract editGender(gender: GenderEnum): Observable<void>;
    public abstract getAvatar(avatarPath: string): string;
    public abstract getAllTags(): Observable<Tag[]>;
    public abstract editTags(tags: Tag[]): Observable<void>;
    public abstract editLocation(location: LocationModel): Observable<void>;
    public abstract editOrientation(orientation: SexualOrientation): Observable<void>;
    public abstract editAvatar(file: File): Observable<void>;
    public abstract getProfilesFiltered(filter: FiltersModel): Observable<SearchResultModel>;
    public abstract getById(id: number): Observable<ProfileCardModel>;
    public abstract likeProfile(id: number): Observable<void>;
    public abstract likerList(): Observable<LikeModel[]>;
    public abstract viewList(): Observable<ProfileViewModel[]>;
}
