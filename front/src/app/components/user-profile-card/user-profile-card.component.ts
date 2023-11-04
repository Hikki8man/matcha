import { Component, OnInit } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ProfileModel } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {
    public profile: ProfileModel;
    public avatarUrl: string | null = null;
    constructor(
        private _authService: IAuthenticationService,
        private _profileService: IProfileService,
    ) {
        this.profile = this._authService.getProfile();
    }
    async ngOnInit() {
        try {
            this.avatarUrl = await this._profileService.getAvatar(this.profile.id);
        } catch (err) {
            console.log('error getting avatar', err);
        }
    }
    public UserLocation: string = 'Lyon, France';
    public IsOnline: boolean = true;

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };
}
