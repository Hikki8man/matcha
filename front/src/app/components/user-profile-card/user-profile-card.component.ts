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
    public AvatarBlob: Blob | undefined = undefined;
    public avatarUrl: string | null = null;
    constructor(
        private _authService: IAuthenticationService,
        private _profileService: IProfileService,
    ) {
        this.profile = this._authService.getProfile();
        //this.UserName = profile.name;
    }
    async ngOnInit() {
        try {
            const avatar = await this._profileService.getAvatar(this.profile.id);
            this.AvatarBlob = avatar;
            this.setAvatarUrl();
        } catch (err) {
            console.log('error getting avatar', err);
        }
    }

    setAvatarUrl() {
        if (this.AvatarBlob) {
            this.avatarUrl = URL.createObjectURL(this.AvatarBlob);
        } else {
            this.avatarUrl = null;
        }
    }
    public ProfileImage: string = 'assets/images/becoshy.png';
    public UserName: string = 'beco';
    public UserBio: string = 'trop shy pour faire une bio 👉👈';
    public UserTags: string[] = ['Shy', 'Cute', 'Becoshy', 'Bien sur', 'Gaëlle?', 'Quoi?'];
    public UserLocation: string = 'Lyon, France';
    public IsOnline: boolean = true;

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };
}
