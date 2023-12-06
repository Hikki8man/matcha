import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProfileCardModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {

	public UserId: number;
	public ProfileCard: ProfileCardModel;
	public Loading: boolean = true;

	private _destroy$ = new Subject<boolean>();

	constructor(
		private readonly _authenticationService: IAuthenticationService,
		private readonly _profileService: IProfileService,
	) {
		this.UserId = this._authenticationService.profileValue.id;
		this._profileService
			.getById(this.UserId)
			.pipe(takeUntil(this._destroy$))
			.subscribe({
				next: (card) => {
					this.ProfileCard = card;
				},
				complete: () => (this.Loading = false),
			});
	}

	ngOnDestroy(): void {
		this._destroy$.next(true);
		this._destroy$.complete();
	}
}
