import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
	selector: 'location-modal',
	templateUrl: './location-modal.component.html',
	styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {

	public LoadingIconUrl: string = IconUrlEnum.Progress;
	public LoadingIconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { redirect: boolean },
		private readonly _completeService: ICompleteProfileService
	) { }

	ngOnInit(): void {
		this._completeService.askForLocation(this.data.redirect);
	}
}
