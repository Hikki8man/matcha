import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
        this._profile = _authenticationService.getProfile();
        this.bioControl = new FormControl(this._profile.bio, {
            validators: [Validators.required],
            nonNullable: true,
        });
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    async onSubmit() {
        console.log('on Submit');
        if (this.bioControl.valid) {
            try {
                await this._completeProfileService.completeBio(this.bioControl.value);
                this._profile.bio = this.bioControl.value;
                this._profile.completed_steps = CompletedSteps.Completed;
                this._router.navigate(['/']);
            } catch (err) {
                console.log('error', err);
            }
        }
    }
}
