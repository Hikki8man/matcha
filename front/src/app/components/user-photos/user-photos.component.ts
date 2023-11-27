import { Component } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'user-photos',
    templateUrl: './user-photos.component.html',
    styleUrls: ['./user-photos.component.scss'],
})
export class UserPhotosComponent {
    public Album: any[] = [];

    constructor(private _lightbox: Lightbox) {
        this.Album.push({ src: 'assets/images/widePutin.png' });
        this.Album.push({ src: 'assets/images/becothanksgiving.png' });
        this.Album.push({ src: 'assets/images/becoshy.png' });
        this.Album.push({ src: 'assets/images/becoscooter.jpg' });
        this.Album.push({ src: 'assets/images/wideMacron.png' });
    }

    protected open(index: number): void {
        this._lightbox.open(this.Album, index, { centerVertically: true });
    }

    protected close(): void {
        this._lightbox.close();
    }
}
