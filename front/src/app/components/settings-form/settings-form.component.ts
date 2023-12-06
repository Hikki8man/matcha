import { Component } from '@angular/core';
import { AccountModel } from 'src/app/models/account.model';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
	selector: 'settings-form',
	templateUrl: './settings-form.component.html',
	styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent {

	public Profile: PublicProfileModel;
	public Account: AccountModel;
	public Loading: boolean = true;

	constructor(
		private readonly _apiServive: IApiService,
		private readonly _authenticationService: IAuthenticationService,
		private readonly _profileService: IProfileService,
	) {
		this._apiServive.callApi<AccountModel>(`account`, 'GET')
			.subscribe((res: AccountModel) => {
				this.Account = res;
				this._profileService
					.getById(this._authenticationService.profileValue.id)
					.subscribe({
						next: (card) => {
							this.Profile = card.profile;
						},
						complete: () => { this.Loading = false },
					});
			});
	}
}
