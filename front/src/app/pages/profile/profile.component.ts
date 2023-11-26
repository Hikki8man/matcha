import { Component } from '@angular/core';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

	public UserId: number;

	constructor(
		private readonly _authenticationService: IAuthenticationService,
	) {
		this.UserId = this._authenticationService.profileValue.id;
	}
}
