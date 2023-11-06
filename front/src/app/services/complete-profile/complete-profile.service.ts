import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenderEnum } from '../../enums/gender-enum';
import { CompletedSteps, ProfileModel, Tag } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { ICompleteProfileService } from './icomplete-profile.service';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CompleteProfileService implements ICompleteProfileService {
    constructor(
        private _router: Router,
        private _apiService: IApiService,
    ) {}

    public completeName(name: string): Observable<void> {
        console.log('name to complete: ', name);
        return this._apiService.callApi('profile/complete/name', 'POST', { name });
    }

    public completeGender(gender: GenderEnum): Observable<void> {
        return this._apiService.callApi('profile/complete/gender', 'POST', { gender });
    }

    public completeAvatar(file: File): Observable<void> {
        const formData = new FormData();
        formData.append('photo', file);
        return this._apiService.callApi('profile/complete/avatar', 'POST', formData);
    }

    public completeTags(tags: Tag[]): Observable<void> {
        return this._apiService.callApi('profile/complete/tags', 'POST', { tags });
    }

    public completeBio(bio: string): Observable<void> {
        return this._apiService.callApi('profile/complete/bio', 'POST', { bio });
    }

    public isProfileCompleteGuard(profile: ProfileModel | undefined): Observable<boolean> {
        if (!profile || profile.completed_steps !== CompletedSteps.Completed) {
            if (profile) {
                this._router.navigate([
                    AppPathEnum.CompleteProfile + '/' + profile.completed_steps,
                ]);
            }

            return of(false);
        }

        console.log('Profile Complete Guard', profile);
        return of(profile.completed_steps === CompletedSteps.Completed);
    }
}
