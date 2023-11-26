import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { FiltersModel } from 'src/app/models/filters.model';
import { GenderEnum } from '../../enums/gender-enum';
import { PublicProfileModel, Tag } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IProfileService } from './iprofile.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService implements IProfileService {
    constructor(private _apiService: IApiService) {}

    public editName(name: string): Observable<void> {
        return this._apiService.callApi('profile/edit/name', 'POST', { name });
    }

    public getById(id: number): Observable<PublicProfileModel> {
        return this._apiService.callApi<PublicProfileModel>(`profile/${id}`, 'GET');
    }

    public editGender(gender: GenderEnum): Observable<void> {
        return this._apiService.callApi('profile/edit/gender', 'POST', { gender });
    }

    public editAvatar(file: File): Observable<void> {
        const formData = new FormData();
        formData.append('photo', file);
        return this._apiService.callApi('profile/edit/avatar', 'POST', formData);
    }

    public getAvatar(id: number): Observable<string> {
        return this._apiService.callApiAvatar<Blob>(`profile/${id}/avatar`).pipe(
            map((avatar: Blob) => URL.createObjectURL(avatar)),
            catchError(() => of('https://www.w3schools.com/howto/img_avatar.png')),
        );
    }

    public getAllTags(): Observable<Tag[]> {
        return this._apiService.callApi<Tag[]>('tags', 'GET');
    }

    public editTags(tags: Tag[]): Observable<void> {
        return this._apiService.callApi('edit/tags', 'POST', { tags });
    }

    public editBio(bio: string): Observable<void> {
        return this._apiService.callApi('profile/edit/bio', 'POST', { bio });
    }

    public getProfilesFiltered(filterModel: FiltersModel): Observable<PublicProfileModel[]> {
        const filter = {
            max_dist: filterModel.DistanceRange,
            min_age: filterModel.MinAge,
            max_age: filterModel.MaxAge,
            common_tags: filterModel.Tags,
            order_by: filterModel.OrderBy,
            offset: filterModel.Offset,
        };
        return this._apiService
            .callApi<PublicProfileModel[]>('profile/filter', 'POST', filter)
            .pipe(
                map((profiles) => {
                    return profiles.map((profile) => ({
                        ...profile,
                        avatar: this.getAvatar(profile.id),
                    }));
                }),
            );
    }

    public likeProfile(id: number): Observable<void> {
        return this._apiService.callApi('profile/like', 'post', { id: +id });
    }
}
