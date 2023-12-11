import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'src/app/models/location.model';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

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
                                console.log('location', data);
                                this._completeService.completeLocation(location).subscribe({
                                    next: () => this._router.navigate(['/']),
                                    error: (err) => console.log(err),
                                });
                            },
                            error: (err) => console.log('error', err),
                        });
                },
                (error) => console.log('allo', error),
            );
        } else {
            console.log('ah oe');
            alert('Geolocation is not supported by this browser.');
        }
    }
}
