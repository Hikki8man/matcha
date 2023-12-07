import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { timeAgo } from 'src/app/utils/timeAgo';


@Component({
	selector: 'notifications-list-item',
	templateUrl: './notifications-list-item.component.html',
	styleUrls: ['./notifications-list-item.component.scss']
})
export class NotificationsListItemComponent implements OnInit {

	public HeartIconUrl: string = IconUrlEnum.Heart;
	public IconStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px', fill: 'var(--title-color)' };

	public UserName: string = 'Test user';
	public Details: string = 'a liké ton profil';
	public AvatarUrl: string = null;

	constructor(
		private readonly _router: Router,
		private readonly _authenticationService: IAuthenticationService,
		private readonly _profileService: IProfileService,
	) { }

	ngOnInit(): void {
		this.AvatarUrl = this._profileService.getAvatar(
            this._authenticationService.profileValue.avatar,
        );
	}

	public redirectToProfile(): void {
		this._router.navigate([AppPathEnum.Profile, '2']);
	}

	public getTimeAgo(): string {
		const date = new Date();
		date.setMinutes(date.getMinutes() - 5);
		return timeAgo(date);
	}
}
