import { Observable } from 'rxjs';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { FiltersModel } from 'src/app/models/filters.model';
import { PublicProfileModel, Tag } from 'src/app/models/profile.model';

export abstract class IProfileService {
    public abstract editName(name: string): Observable<void>;
    public abstract editBio(bio: string): Observable<void>;
    public abstract editGender(gender: GenderEnum): Observable<void>;
    public abstract editAvatar(photo: any): Observable<void>;
    public abstract getAvatar(id: number): Observable<string>;
    public abstract getAllTags(): Observable<Tag[]>;
    public abstract editTags(tags: Tag[]): Observable<void>;
    public abstract getProfilesFiltered(filter: FiltersModel): Observable<PublicProfileModel[]>;
    public abstract getById(id: number): Observable<PublicProfileModel>;
}
