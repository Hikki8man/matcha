import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { CompletedSteps } from '../../models/profile.model';
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

    public completeFirstStep(): Observable<void> {
        return this._apiService.callApi('profile/complete/first', 'POST');
    }

    public completeSecondStep(): Observable<void> {
        return this._apiService.callApi('profile/complete/second', 'POST');
    }

    public completeThirdStep(): Observable<void> {
        return this._apiService.callApi('profile/complete/third', 'POST');
    }

    public isProfileCompleteGuard(): boolean {
        console.log('complete guard');
        const profile = this._authService.profileValue;
        if (!profile || profile.completed_steps !== CompletedSteps.Completed) {
            if (profile) {
                this._router.navigate([AppPathEnum.CompleteProfile]);
            }
            return false;
        }
        return true;
    }

    public isProfileNotCompleteGuard(): boolean {
        console.log('not complete guard');
        const profile = this._authService.profileValue;
        if (!profile) return true;

        if (profile.completed_steps === CompletedSteps.Completed) {
            this._router.navigate([AppPathEnum.Profile + '/me']);
            return false;
        }
        return true;
    }
}
