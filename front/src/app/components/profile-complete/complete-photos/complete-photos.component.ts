import { Component, EventEmitter, Output } from '@angular/core';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
	selector: 'complete-photos',
	templateUrl: './complete-photos.component.html',
	styleUrls: ['./complete-photos.component.scss']
})
export class CompletePhotosComponent {

	public Step: number = 0;
	public Profile: PublicProfileModel = new PublicProfileModel();
	public Avatar: string;
	public AvatarUrl: string;

	@Output() public OnComplete: EventEmitter<void> = new EventEmitter<void>();

	constructor(
		private readonly _authenticationService: IAuthenticationService,
		private readonly _profileService: IProfileService,
	) {
		const profile = this._authenticationService.profileValue;
		this.Profile.id = profile.id;
		this.Profile.photos = profile.photos;
		if (profile.avatar) {
			this.updateAvatar(profile.avatar);
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
