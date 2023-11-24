import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
    template: ``,
})
export class CompleteProfileLocationComponent implements OnInit {
    public lat: number;
    public lng: number;

    constructor(private _httpClient: HttpClient) {}

    public ngOnInit(): void {
        this.getLocation();
    }

    getLocation() {
        // const API_KEY = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                    console.log(this.lat);
                    console.log(this.lng);
                    this._httpClient
                        .get(
                            `https://ipwho.is/`,
                            // `https://api.geoapify.com/v1/geocode/reverse?lat=${this.lat}&lon=${this.lng}&apiKey=${API_KEY}`,
                        )
                        .subscribe({
                            next: (data) => {
                                console.log('data: ', data);
                            },
                            error: (err) => console.log('error', err),
                        });
                },
                (error) => console.log(error),
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
}
