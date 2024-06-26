import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { FiltersModel } from 'src/app/models/filters.model';
import { LikeModel } from 'src/app/models/like.model';
import { LocationModel } from 'src/app/models/location.model';
import { ProfileViewModel } from 'src/app/models/profile-view.model';
import { timeAgo } from 'src/app/utils/timeAgo';
import { environment } from 'src/environment/environment';
import { GenderEnum } from '../../enums/gender-enum';
import { ProfileCardModel, SearchResultModel, Tag } from '../../models/profile.model';
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

    public getById(id: number): Observable<ProfileCardModel> {
        return new Observable((observer) => {
            this._apiService.callApi<ProfileCardModel>(`profile/${id}`, 'GET').subscribe({
                next: (card) => {
                    card.profile.avatar = this.getAvatar(card.profile.avatar);
                    observer.next(card);
                    observer.complete();
                },
                error: (error) => observer.error(error),
            });
        });
    }

    public editGender(gender: GenderEnum): Observable<void> {
        return this._apiService.callApi('profile/edit/gender', 'POST', { gender });
    }

    public editAvatar(file: File): Observable<void> {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('photo_type', 'avatar');
        return this._apiService.callApi('profile/edit/photo', 'POST', formData);
    }

    public getAvatar(avatarPath: string): string {
        return avatarPath
            ? environment.apiBaseUrl + '/' + avatarPath
            : 'assets/images/img_avatar.png';
    }

    public getAllTags(): Observable<Tag[]> {
        return this._apiService.callApi<Tag[]>('tags', 'GET');
    }

    public editTags(tags: Tag[]): Observable<void> {
        return this._apiService.callApi('profile/edit/tags', 'POST', { tags });
    }

    public editBio(bio: string): Observable<void> {
        return this._apiService.callApi('profile/edit/bio', 'POST', { bio });
    }

    public editLocation(location: LocationModel): Observable<void> {
        return this._apiService.callApi('profile/edit/location', 'POST', location);
    }

    public editOrientation(orientation: SexualOrientation): Observable<void> {
        return this._apiService.callApi('profile/edit/sexual-orientation', 'POST', { orientation });
    }

    public getProfilesFiltered(filterModel: FiltersModel): Observable<SearchResultModel> {
        const filter = {
            max_dist: filterModel.DistanceRange,
            min_age: filterModel.MinAge,
            max_age: filterModel.MaxAge,
            min_fame: filterModel.MinFameRating,
            max_fame: filterModel.MaxFameRating,
            common_tags: filterModel.Tags,
            order_by: filterModel.OrderBy,
            offset: filterModel.Offset,
        };
        return this._apiService.callApi<SearchResultModel>('profile/filter', 'POST', filter).pipe(
            tap((result) => {
                for (const profile of result.profiles) {
                    profile.avatar = this.getAvatar(profile.avatar);
                }
            }),
        );
    }

    public likeProfile(id: number): Observable<void> {
        return this._apiService.callApi('profile/like', 'POST', { id: +id });
    }

    public likerList(): Observable<LikeModel[]> {
        return this._apiService.callApi<LikeModel[]>('profile/like/likers', 'GET').pipe(
            map((likers) => {
                return likers.map((liker) => ({
                    ...liker,
                    time_ago: timeAgo(liker.created_at),
                    avatar: this.getAvatar(liker.avatar),
                }));
            }),
        );
    }
    public viewList(): Observable<ProfileViewModel[]> {
        return this._apiService.callApi<ProfileViewModel[]>('profile/views', 'GET').pipe(
            map((views) => {
                return views.map((view) => ({
                    ...view,
                    time_ago: timeAgo(view.created_at),
                    avatar: this.getAvatar(view.avatar),
                }));
            }),
        );
    }
}
