import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { LocationModel } from 'src/app/models/location.model';
import { CompletedSteps } from 'src/app/models/profile.model';
import { IAuthenticationService } from '../authentication/iauthentication.service';
import { ICompleteProfileService } from '../complete-profile/icomplete-profile.service';
import { IProfileService } from '../profile/iprofile.service';
import { ILocationService } from './ilocation.service';

@Injectable({
    providedIn: 'root',
})
export class LocationService implements ILocationService {
    constructor(
        private _router: Router,
        private readonly _httpClient: HttpClient,
        private readonly _toastService: HotToastService,
        private readonly _dialog: MatDialog,
        private readonly _profileService: IProfileService,
        private readonly _completeService: ICompleteProfileService,
        private readonly _authService: IAuthenticationService,
    ) {}
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
                    this._profileService.editLocation(location).subscribe({
                        next: () => {
                            this.afterLocationSubmit(redirect);
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
            this._profileService.editLocation(location).subscribe({
                next: () => {
                    this.afterLocationSubmit(redirect);
                },
                error: (err) => console.log(err),
            });
        });
    }

    private afterLocationSubmit(redirect: boolean): void {
        if (redirect) {
            this._completeService.completeThirdStep().subscribe((_) => {
                this._authService.profileValue.completed_steps = CompletedSteps.Completed;
                this._router.navigate(['/']);
            });
        } else {
            this._toastService.success('Ta localisation a bien été mise à jour', {
                position: 'bottom-center',
            });
        }
        this._dialog.closeAll();
    }
}
