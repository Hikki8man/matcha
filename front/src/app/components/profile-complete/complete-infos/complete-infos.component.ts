import { Component } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
	selector: 'complete-infos',
	templateUrl: './complete-infos.component.html',
	styleUrls: ['./complete-infos.component.scss']
})
export class CompleteInfosComponent {

	public Name: string;
	public Bio: string;
	public Step: number = 0;

	constructor(
		private readonly _authenticationService: IAuthenticationService,
		private readonly _completeProfileService: ICompleteProfileService,
		private readonly _toastService: HotToastService,
	) { 
		this.Name = this._authenticationService.profileValue.name;
		this.Bio = this._authenticationService.profileValue.bio;
	}

	public submitName(): void {
		this._completeProfileService.completeName(this.Name).subscribe({
			complete: () => {
				this.Step = 1;
			},
			error: (error) => {
				this._toastService.error(error.error);
			},
		});
	}

	public submitBio(): void {
		this._completeProfileService.completeBio(this.Bio).subscribe({
			complete: () => {
				this.Step = 2;
			},
			error: (error) => {
				this._toastService.error(error.error);
			},
		});
	}
}
