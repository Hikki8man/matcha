import { Injectable } from '@angular/core';
import { AuthService } from './auth.sevice';
import { CompletedSteps, Gender } from '../models/profile.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { IApiService } from './iapi.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _apiService: IApiService,
    ) {}

    editName(name: string) {
        console.log('name to edit: ', name);
        return this._apiService.callApi('profile/edit/name', 'POST', name);
    }

    editGender(gender: Gender) {
        return this._apiService.callApi('profile/edit/gender', 'POST', gender);
    }

    profileCompleteGuard() {
        console.log('Profile Complete Guard');
        if (this._authService.getAuth().profile.completed_steps === CompletedSteps.Completed) {
            return true;
        }
        this._router.navigate(['/complete-profile']);
        return false;
    }
}
