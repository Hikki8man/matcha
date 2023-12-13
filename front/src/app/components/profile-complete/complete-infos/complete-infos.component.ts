import { Component, EventEmitter, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { ChoiceItem } from 'src/app/models/choice-item.model';
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
	public Gender: GenderEnum;
	public Orientation: SexualOrientation;
	public Step: number = 0;
	public GenderChoices: ChoiceItem[] = [
		new ChoiceItem('Homme', GenderEnum.Male),
		new ChoiceItem('Femme', GenderEnum.Female),
		new ChoiceItem('Autre', GenderEnum.Other),
	];
	public OrientationItems: ChoiceItem[] = [
		new ChoiceItem('Heterosexuel', SexualOrientation.Heterosexual),
		new ChoiceItem('Homosexuel', SexualOrientation.Homosexual),
		new ChoiceItem('Bisexuel', SexualOrientation.Bisexual),
	];

	@Output() public OnComplete: EventEmitter<void> = new EventEmitter<void>();

	constructor(
		private readonly _authenticationService: IAuthenticationService,
		private readonly _completeProfileService: ICompleteProfileService,
		private readonly _toastService: HotToastService,
	) { 
		const profile = this._authenticationService.profileValue;
		this.Name = profile.name;
		this.Bio = profile.bio;
		this.Gender = profile.gender;
		this.Orientation = profile.sexual_orientation;
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

	public submitGender(): void {
		this._completeProfileService.completeGender(this.Gender).subscribe({
			complete: () => {
				this.Step = 3;
			},
			error: (error) => {
				this._toastService.error(error.error);
			},
		});
	}

	public submitOrientation(): void {
		this._completeProfileService.completeSexualOrientation(this.Orientation).subscribe({
			complete: () => {
				this.OnComplete.emit();
			},
			error: (error) => {
				this._toastService.error(error.error);
			},
		});
	}

	public updateOrientation(choice: ChoiceItem) {
		this.Orientation = Object.values(SexualOrientation).find(x => x == choice.Value);
	}

	public getSelectedOrientationItem(): ChoiceItem {
		return this.OrientationItems.find(x => x.Value === this.Orientation);
	}

	public updateGender(choice: ChoiceItem) {
		this.Gender = Object.values(GenderEnum).find(x => x == choice.Value);
	}

	public getSelectedGenderItem(): ChoiceItem {
		return this.GenderChoices.find(x => x.Value === this.Gender);
	}
}