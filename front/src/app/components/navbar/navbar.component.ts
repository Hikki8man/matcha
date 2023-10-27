import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

	public UserIconUrl: string = IconUrlEnum.User;
	public UsersIconUrl: string = IconUrlEnum.Users;
	public MessageIconUrl: string = IconUrlEnum.Message;
	public SettingsIconUrl: string = IconUrlEnum.Settings;

	public IconStyle: Record<string, string> = { display: 'flex', height: '22px', width: '22px' };

	public isCurrentPage(page: string): boolean {
		return window.location.href.includes(page);
	}
}
