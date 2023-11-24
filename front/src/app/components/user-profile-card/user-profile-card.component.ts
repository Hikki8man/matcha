import { Component, Input, OnInit } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit {

    @Input() public UserId: number;
    public IsOtherUser: boolean = false;

    public profile: PublicProfileModel;

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _authenticationService: IAuthenticationService,
    ) {
    }

    ngOnInit(): void {
        this._profileService.getById(this.UserId).subscribe((profile) => {
            this.profile = profile;
            this.profile.avatar = this._profileService.getAvatar(this.UserId);
        });

        this.IsOtherUser = this.UserId !== this._authenticationService.profileValue.id;
    }

    public UserLocation: string = 'Lyon, France';
    public IsOnline: boolean = true;

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };

    public handleLikeStatusChanged(isLiked: boolean) {
        console.log(isLiked);
    }
}
