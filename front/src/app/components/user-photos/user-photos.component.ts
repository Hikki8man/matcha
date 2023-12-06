import { Component, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { environment } from 'src/environment/environment';

@Component({
    selector: 'user-photos',
    templateUrl: './user-photos.component.html',
    styleUrls: ['./user-photos.component.scss'],
})
export class UserPhotosComponent {

    @Input() public IsEdit: boolean = false;
    @Input()
    set Profile(value: PublicProfileModel) {
        this._profile = value;
        if (value)
            this.init();
    }
    get Profile(): PublicProfileModel {
        return this._profile;
    }

    private _profile: PublicProfileModel;
    public Album: any[] = [];

    constructor(
        private readonly _lightbox: Lightbox,
    ) { }

    private init() {
        console.log(this.Profile);
        this.Profile.photos.forEach((photo) => {
            const photoPath = environment.apiBaseUrl + '/' + photo.path;
            this.Album.push({ src: photoPath });
        });
    }

    protected open(index: number): void {
        this._lightbox.open(this.Album, index, { centerVertically: true });
    }

    protected close(): void {
        this._lightbox.close();
    }
}
