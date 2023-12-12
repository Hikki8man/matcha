import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { AccountModel } from 'src/app/models/account.model';
import { PublicProfileModel, Tag } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { SelectTagsModalComponent } from '../select-tags-modal/select-tags-modal.component';

@Component({
	selector: 'settings-form',
	templateUrl: './settings-form.component.html',
	styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent {

	public Profile: PublicProfileModel;
	public Account: AccountModel;
	public Loading: boolean = true;

	public IconEditUrl: string = IconUrlEnum.Edit;
	public IconStyle: Record<string, string> = { display: 'flex', width: '16px', height: '16px' };

	constructor(
		private readonly _apiServive: IApiService,
		private readonly _authenticationService: IAuthenticationService,
		private readonly _profileService: IProfileService,
		private readonly _toast: HotToastService,
		private readonly _dialog: MatDialog,
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

	public openTagsSelectionModal(): void {
		const dialog = this._dialog.open(
			SelectTagsModalComponent,
			{
				width: '600px',
				autoFocus: false,
				data: {
					SelectedTags: this.Profile.tags,
				}
			}
		);
		dialog.afterClosed().subscribe((tags) => {
			if (tags)
				this.handleSelectedTagsChanged(tags);
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
