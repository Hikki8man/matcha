import { Component, EventEmitter, Output } from '@angular/core';
import { ProfileModel, PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'complete-photos',
    templateUrl: './complete-photos.component.html',
    styleUrls: ['./complete-photos.component.scss'],
})
export class CompletePhotosComponent {
    public Step: number = 0;
    public Profile: PublicProfileModel = new PublicProfileModel();
    public Avatar: string;
    public AvatarUrl: string;
    private _profile: ProfileModel;

    @Output() public OnComplete: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private readonly _authenticationService: IAuthenticationService,
        private readonly _profileService: IProfileService,
    ) {
        this._profile = this._authenticationService.profileValue;
        this.Profile.id = this._profile.id;
        this.Profile.photos = this._profile.photos;
        if (this._profile.avatar) {
            this.updateAvatar(this._profile.avatar);
        }
    }

    public updateAvatar(avatar: string): void {
        this.Avatar = avatar;
        this.AvatarUrl = this._profileService.getAvatar(this.Avatar);
        this.Step = 1;
    }

    public handleComplete(): void {
        this.OnComplete.emit();
    }
}
