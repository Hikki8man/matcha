import { Component, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
    selector: 'user-photos',
    templateUrl: './user-photos.component.html',
    styleUrls: ['./user-photos.component.scss'],
})
export class UserPhotosComponent {

    @Input() public IsEdit: boolean = false;

    public Album: any[] = [];

    constructor(
        private readonly _lightbox: Lightbox,
        private readonly _authenticationService: IAuthenticationService,
    ) {
        this.Album.push({ src: 'assets/images/widePutin.png' });
        this.Album.push({ src: 'assets/images/becothanksgiving.png' });
        this.Album.push({ src: 'assets/images/becoshy.png' });
        this.Album.push({ src: 'assets/images/becoscooter.jpg' });
        this.Album.push({ src: 'assets/images/wideMacron.png' });
        console.log(this._authenticationService.profileValue);
        
    }

    protected open(index: number): void {
        this._lightbox.open(this.Album, index, { centerVertically: true });
    }

    protected close(): void {
        this._lightbox.close();
    }
}
