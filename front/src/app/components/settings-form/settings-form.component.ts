import { Component } from '@angular/core';
import { AccountModel } from 'src/app/models/account.model';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
	selector: 'settings-form',
	templateUrl: './settings-form.component.html',
	styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent {

	public Profile: ProfileModel;
	public Email: string;

	constructor(
		private readonly _apiServive: IApiService,
		private readonly _authenticationService: IAuthenticationService,
	) {
		this._apiServive.callApi<AccountModel>(`user/${this._authenticationService.profileValue.id}`, 'GET')
			.subscribe((res: AccountModel) => {
				this.Email = res.email;
			});
		this.Profile = this._authenticationService.profileValue;
		console.log(this.Profile);
	}
}
