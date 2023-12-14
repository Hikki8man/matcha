import { Component, OnInit } from '@angular/core';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
	selector: 'location-modal',
	templateUrl: './location-modal.component.html',
	styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {

	constructor(
		private readonly _completeService: ICompleteProfileService
	) { }

	ngOnInit(): void {
		this._completeService.askForLocation();
		console.log('location modal');
		
	}
}
