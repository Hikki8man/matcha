import { Component, Input } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ProfileCardModel, PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    @Input()
    set ProfileCard(value: ProfileCardModel) {
        this._profileCard = value;
        if (value) this.init();
    }
    get ProfileCard(): ProfileCardModel {
        return this._profileCard;
    }
    @Input() public Loading: boolean = true;

    private _profileCard: ProfileCardModel;
    public IsOtherUser: boolean = false;
    public Profile: PublicProfileModel;
    public Liked: boolean = false;
    public LikedYou: boolean = false;

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _authenticationService: IAuthenticationService,
    ) {}

    private init(): void {
        this.Profile = this.ProfileCard.profile;
        this.IsOtherUser = this.Profile.id !== this._authenticationService.profileValue.id;
        this.Liked = this.ProfileCard.liked;
        this.LikedYou = this.ProfileCard.likedYou;
    }

    public LocationIconUrl: string = IconUrlEnum.Location;
    public FameRatingIconUrl: string = IconUrlEnum.Star;
    public IconStyle: Record<string, string> = { display: 'flex', height: '16px' };

    public handleLikeStatusChanged(liked: boolean) {
        this.Liked = liked;
        this._profileService.likeProfile(this.Profile.id).subscribe();
    }
}
