import { Component, OnInit } from '@angular/core';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
    template: ``,
})
export class CompleteProfileLocationComponent implements OnInit {

    constructor(
        private _completeService: ICompleteProfileService,
    ) {}

    public ngOnInit(): void {
        this._completeService.askForLocation();
    }
}
