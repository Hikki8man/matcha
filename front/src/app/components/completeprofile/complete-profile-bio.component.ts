import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CompletedSteps, ProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
    template: `
        <input type="text" [formControl]="bioControl" />
        <button (click)="onSubmit()">Next</button>
    `,
})
export class CompleteProfileBioComponent implements OnInit {
    private _profile: ProfileModel;

    public bioControl: FormControl;
    constructor(
        private _authenticationService: IAuthenticationService,
        private _completeProfileService: ICompleteProfileService,
        private _router: Router,
    ) {
        this._profile = _authenticationService.profileValue!;
        this.bioControl = new FormControl(this._profile.bio, {
            nonNullable: true,
        });
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    onSubmit() {
        console.log('on Submit');
        if (this.bioControl.valid) {
            this._completeProfileService.completeBio(this.bioControl.value).subscribe({
                complete: () => {
                    this._profile.bio = this.bioControl.value;
                    this._profile.completed_steps = CompletedSteps.Completed;
                    this._router.navigate(['complete-profile/location']);
                },
                error: (error) => {
                    console.error('Error:', error);
                },
            });
        }
    }
}
