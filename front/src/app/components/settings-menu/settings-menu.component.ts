import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
	selector: 'settings-menu',
	templateUrl: './settings-menu.component.html',
	styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {

	public SettingsIconUrl: string = IconUrlEnum.Settings;
	public LogoutIconUrl: string = IconUrlEnum.Logout;
	public IconStyle: Record<string, string> = { display: 'flex', height: '16px', width: '16px' };
	public UserName: string;

	constructor(
		private readonly _authenticationService: IAuthenticationService,
	) {
		this.UserName = this._authenticationService.profileValue.name;	
	}

	public logout(): void {
        this._authenticationService.logout();
    }
}
