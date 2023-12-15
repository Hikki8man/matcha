import { Component, Input } from '@angular/core';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { PublicProfileModel } from 'src/app/models/profile.model';

@Component({
	selector: 'user-about',
	templateUrl: './user-about.component.html',
	styleUrls: ['./user-about.component.scss']
})
export class UserAboutComponent {

	@Input() public Profile: PublicProfileModel;

	private _orientations = {
		[SexualOrientation.Heterosexual]: 'Hétérosexuel',
		[SexualOrientation.Homosexual]: 'Homosexuel',
		[SexualOrientation.Bisexual]: 'Bisexuel',
	};

	private _genders = {
		[GenderEnum.Male]: 'Homme',
		[GenderEnum.Female]: 'Femme',
		[GenderEnum.Other]: 'Autre',
	};

	public getOrientation(): string {
		return this._orientations[this.Profile.sexual_orientation];
	}

	public getGender(): string {
		return this._genders[this.Profile.gender];
	}
}
