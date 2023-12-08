import { Component } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { AccountModel } from 'src/app/models/account.model';
import { PublicProfileModel, Tag } from 'src/app/models/profile.model';
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
		private readonly _toast: HotToastService,
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

	public handleBioChanged(bio: string): void {
		this._profileService.editBio(bio).subscribe({
			complete: () => {
				this.Profile.bio = bio;
				this._toast.success('Bio mise à jour', { position: 'bottom-center' });
			},
			error: (err) => {
				this._toast.error('Erreur lors de la mise à jour de la bio', { position: 'bottom-center' });
				throw err;
			},
		});
	}

	public handleSelectedTagsChanged(tags: Tag[]): void {
		this._profileService.editTags(tags).subscribe({
			complete: () => {
				this.Profile.tags = tags;
				this._toast.success('Tags mis à jour', { position: 'bottom-center' });
			},
			error: (err) => {
				this._toast.error('Erreur lors de la mise à jour des tags', { position: 'bottom-center' });
				throw err;
			},
		});
	}

	public handleEmailChanged(email: string): void {
		console.log(email);
	}

	public handleFirstNameChanged(firstName: string): void {
		console.log(firstName);
	}

	public handleLastNameChanged(lastName: string): void {
		console.log(lastName);
	}

	public handleLocateClick(): void {
		//this._toast.error('Ouais ça arrive fort', { position: 'bottom-center' });
	}
}
