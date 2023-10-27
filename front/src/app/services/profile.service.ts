import { Injectable } from '@angular/core';
import { AuthService } from './auth.sevice';
import { CompletedSteps, Gender } from '../models/profile.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _httpClient: HttpClient,
    ) {}

    editName(name: string) {
        console.log('name to edit: ', name);
        return this._httpClient.post(
            `${environment.apiBaseUrl}/profile/edit/name`,
            { name },
            {
                withCredentials: true,
            },
        );
    }

    editGender(gender: Gender) {
        return this._httpClient.post(
            'http://10.11.9.2:8080/profile/edit/gender',
            { gender },
            {
                withCredentials: true,
            },
        );
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
