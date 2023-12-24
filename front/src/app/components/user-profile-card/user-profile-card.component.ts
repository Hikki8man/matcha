import { Component, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ProfileCardModel, PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { timeAgo } from 'src/app/utils/timeAgo';

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
    public LastOnline: string = '';
    public Album: any[] = [];
    public Status: boolean = false;

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _authenticationService: IAuthenticationService,
        private readonly _lightbox: Lightbox,
    ) {}

    private init(): void {
        this.Profile = this.ProfileCard.profile;
        this.IsOtherUser = this.Profile.id !== this._authenticationService.profileValue.id;
        this.Liked = this.ProfileCard.liked;
        this.LikedYou = this.ProfileCard.likedYou;
        this.Status = this.ProfileCard.profile.online;
        if (!this.IsOtherUser) {
            this.Status = true;
        }
        this.LastOnline = timeAgo(this.Profile.last_online);
        this.Album.push({ src: this.Profile.avatar });
    }

    public LocationIconUrl: string = IconUrlEnum.Location;
    public IconStyle: Record<string, string> = { display: 'flex', height: '16px' };

    public handleLikeStatusChanged(liked: boolean) {
        this.Liked = liked;
        this._profileService.likeProfile(this.Profile.id).subscribe();
    }

    protected open(index: number): void {
        this._lightbox.open(this.Album, index, { centerVertically: true });
    }

    protected close(): void {
        this._lightbox.close();
    }
}
