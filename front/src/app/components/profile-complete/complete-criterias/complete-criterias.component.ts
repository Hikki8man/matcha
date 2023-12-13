import { Component } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Tag } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
	selector: 'complete-criterias',
	templateUrl: './complete-criterias.component.html',
	styleUrls: ['./complete-criterias.component.scss']
})
export class CompleteCriteriasComponent {

	public Tags: Tag[] = [];

	constructor(
		private readonly _authenticationService: IAuthenticationService,
		private readonly _completeProfileService: ICompleteProfileService,
		private readonly _toastService: HotToastService,
	) {
		this.Tags = this._authenticationService.profileValue.tags;
	}

	public handleSelectedTagsChange(selectedTags: Tag[]): void {
		this.Tags = selectedTags;
	}
	
	public handleSubmit(): void {
		this._completeProfileService.completeTags(this.Tags).subscribe({
			complete: () => {
				// open modal
			},
			error: (error) => {
				this._toastService.error(error.error);
			},
		});
	}
}
