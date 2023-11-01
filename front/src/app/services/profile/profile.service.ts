import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenderEnum } from '../../enums/gender-enum';
import { CompletedSteps } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { AuthenticationService } from '../authentication/authentication.sevice';
import { IProfileService } from './iprofile.service';
import { AppPathEnum } from 'src/app/enums/app-path-enum';

@Injectable({
    providedIn: 'root',
})
export class ProfileService implements IProfileService {
    constructor(
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private _apiService: IApiService,
    ) {}

    public editName(name: string): Promise<void> {
        console.log('name to edit: ', name);
        return this._apiService.callApi('profile/edit/name', 'POST', name);
    }

    public editGender(gender: GenderEnum): Promise<void> {
        return this._apiService.callApi('profile/edit/gender', 'POST', gender);
    }

    public async isProfileCompleteGuard(): Promise<boolean> {
        console.log('Profile Complete Guard');
        if ((await this._authenticationService.getCurrentUser()).completed_steps === CompletedSteps.Completed) {
            return true;
        }
        this._router.navigate([AppPathEnum.CompleteProfile]);
        return false;
    }
}
