import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ProfileModel } from 'src/app/models/profile.model';
import { Observable } from 'rxjs';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    public profile: ProfileModel | undefined;
    public avatar: Observable<string>;
    constructor(
        private _authService: IAuthenticationService,
        private _profileService: IProfileService,
    ) {
        this.profile = this._authService.profileValue;
        if (this.profile) {
            this.avatar = this._profileService.getAvatar(this.profile.id);
        }
    }

    public UserLocation: string = 'Lyon, France';
    public IsOnline: boolean = true;

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };
}
