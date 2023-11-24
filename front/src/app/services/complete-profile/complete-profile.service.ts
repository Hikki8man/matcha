import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { GenderEnum } from '../../enums/gender-enum';
import { CompletedSteps, Tag } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IAuthenticationService } from '../authentication/iauthentication.service';
import { ICompleteProfileService } from './icomplete-profile.service';

@Injectable({
    providedIn: 'root',
})
export class CompleteProfileService implements ICompleteProfileService {
    constructor(
        private _router: Router,
        private _apiService: IApiService,
        private _authService: IAuthenticationService,
    ) {}

    public completeName(name: string): Observable<void> {
        console.log('name to complete: ', name);
        return this._apiService.callApi('profile/complete/name', 'POST', { name });
    }

    public completeGender(gender: GenderEnum): Observable<void> {
        return this._apiService.callApi('profile/complete/gender', 'POST', { gender });
    }

    public completeSexualOrientation(orientation: SexualOrientation): Observable<void> {
        return this._apiService.callApi('profile/complete/sexual-orientation', 'POST', {
            orientation,
        });
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

    public isProfileCompleteGuard(): boolean {
        const profile = this._authService.profileValue;
        if (!profile || profile.completed_steps !== CompletedSteps.Completed) {
            if (profile) {
                this._router.navigate([
                    AppPathEnum.CompleteProfile + '/' + profile.completed_steps,
                ]);
            }
            return false;
        }
        return true;
    }
}
