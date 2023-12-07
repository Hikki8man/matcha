import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { timeAgo } from 'src/app/utils/timeAgo';


@Component({
	selector: 'notifications-list-item',
	templateUrl: './notifications-list-item.component.html',
	styleUrls: ['./notifications-list-item.component.scss']
})
export class NotificationsListItemComponent {

	public HeartIconUrl: string = IconUrlEnum.Heart;
	public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px', fill: 'var(--title-color)' };

	public UserName: string = 'Test user';
	public Details: string = 'a liké ton profil';

	constructor(
		private readonly _router: Router,
	) { }

	public redirectToProfile(): void {
		this._router.navigate([AppPathEnum.Profile, '2']);
	}

	public getTimeAgo(): string {
		const date = new Date();
		date.setMinutes(date.getMinutes() - 5);
		return timeAgo(date);
	}
}
