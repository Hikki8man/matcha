import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'src/app/models/location.model';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    template: `<div>{{ latitude + ' ' + longitude }}</div>`,
})
export class CompleteProfileLocationComponent implements OnInit {
    public latitude: number;
    public longitude: number;

    constructor(
        private _httpClient: HttpClient,
        private _completeService: ICompleteProfileService,
        private _router: Router,
        private _toastService: HotToastService,
    ) {}

    public async ngOnInit(): Promise<void> {
        await this.getLocation();
    }

    async getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    console.log(this.latitude);
                    console.log(this.longitude);
                    this._httpClient
                        .get(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${this.latitude}&longitude=${this.longitude}`,
                        )
                        .subscribe({
                            next: (data: any) => {
                                const location: LocationModel = {
                                    country: data.countryName,
                                    city: data.city,
                                    latitude: this.latitude,
                                    longitude: this.longitude,
                                };
                                this._completeService.completeLocation(location).subscribe({
                                    next: () => this._router.navigate(['/']),
                                    error: (err) => console.log(err), //TODO toaster
                                });
                            },
                            error: (_) =>
                                this._toastService.error(
                                    'Une erreur est survenue, merci de réessayer ultérieurement',
                                ),
                        });
                },
                (_) => {
                    this._httpClient.get(`https://ipwho.is`).subscribe((data: any) => {
                        const location: LocationModel = {
                            country: data.country,
                            city: data.city,
                            latitude: data.latitude,
                            longitude: data.longitude,
                        };
                        this._completeService.completeLocation(location).subscribe({
                            next: () => this._router.navigate(['/']),
                            error: (err) => console.log(err),
                        });
                    });
                },
            );
        } else {
            console.log('ah oe');
            alert('Geolocation is not supported by this browser.');
        }
    }
}
