import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { LocationModel } from 'src/app/models/location.model';
import { GenderEnum } from '../../enums/gender-enum';
import { CompletedSteps, Tag } from '../../models/profile.model';
import { IApiService } from '../api/iapi.service';
import { IAuthenticationService } from '../authentication/iauthentication.service';
import { ICompleteProfileService } from './icomplete-profile.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class CompleteProfileService implements ICompleteProfileService {
    constructor(
        private _router: Router,
        private _apiService: IApiService,
        private _authService: IAuthenticationService,
        private readonly _httpClient: HttpClient,
        private readonly _toastService: HotToastService,
        private readonly _dialog: MatDialog,
    ) { }

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

    public completeLocation(location: LocationModel): Observable<void> {
        return this._apiService.callApi('profile/complete/location', 'POST', location);
    }

    public isProfileCompleteGuard(): boolean {
        const profile = this._authService.profileValue;
        if (!profile || profile.completed_steps !== CompletedSteps.Completed) {
            if (profile) {
                this._router.navigate([
                    AppPathEnum.CompleteProfile
                ]);
            }
            return false;
        }
        return true;
    }

    public isProfileNotCompleteGuard(): boolean {
        const profile = this._authService.profileValue;
        if (!profile) return true;

        if (profile.completed_steps === CompletedSteps.Completed) {
            console.log('profile completed');

            this._router.navigate([AppPathEnum.Profile + '/me']);
            return false;
        }
        return true;
    }

    public askForLocation(redirect: boolean): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    this.updateLocationFromPosition(position, redirect);
                },
                (_) => {
                    console.log(_);

                    this.updateLocationFromIp(redirect);
                },
            );
        } else {
            console.log('ah oe');
            alert('Geolocation is not supported by this browser.');
        }
    }

    private updateLocationFromPosition(position: GeolocationPosition, redirect: boolean): void {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this._httpClient
            .get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
            )
            .subscribe({
                next: (data: any) => {
                    const location: LocationModel = {
                        country: data.countryName,
                        city: data.city,
                        latitude: latitude,
                        longitude: longitude,
                    };
                    this.completeLocation(location).subscribe({
                        next: () => {
                            if (redirect) {
                                this._router.navigate(['/']);
                            } else {
                                this._toastService.success('Ta localisation a bien été mise à jour', { position: 'bottom-center' });
                            }
                            this._dialog.closeAll();
                        },
                        error: (err) => console.log(err), //TODO toaster
                    });
                },
                error: (_) =>
                    this._toastService.error(
                        'Une erreur est survenue, merci de réessayer ultérieurement',
                    ),
            });
    }

    private updateLocationFromIp(redirect: boolean): void {
        this._httpClient.get(`https://ipwho.is`).subscribe((data: any) => {
            const location: LocationModel = {
                country: data.country,
                city: data.city,
                latitude: data.latitude,
                longitude: data.longitude,
            };
            this.completeLocation(location).subscribe({
                next: () => {
                    if (redirect) {
                        this._router.navigate(['/']);
                    } else {
                        this._toastService.success('Ta localisation a bien été mise à jour', { position: 'bottom-center' });
                    }
                    this._dialog.closeAll();
                },
                error: (err) => console.log(err),
            });
        });
    }
}
