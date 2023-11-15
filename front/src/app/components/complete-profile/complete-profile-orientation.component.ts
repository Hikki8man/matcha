import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { ProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
    template: `
        <label for="sexual-orientation">Sexual orientation</label>
        <select id="sexual-orientation" [formControl]="orientationControl">
            <option [value]="gender" *ngFor="let gender of genders">{{ gender }}</option>
        </select>
        <button (click)="onSubmit()">Next</button>
    `,
})
export class CompleteProfileSexualOrientationComponent implements OnInit {
    private _profile: ProfileModel;

    public orientationControl: FormControl;
    public genders: SexualOrientation[] = Object.values(SexualOrientation);

    constructor(
        private _authenticationService: IAuthenticationService,
        private _completeProfileService: ICompleteProfileService,
        private _router: Router,
    ) {
        this._profile = _authenticationService.profileValue!;
        this.orientationControl = new FormControl<SexualOrientation>(SexualOrientation.Bisexual, {
            validators: [Validators.required],
            nonNullable: true,
        });
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    onSubmit() {
        console.log('on Submit');
        if (this.orientationControl.valid) {
            this._completeProfileService
                .completeSexualOrientation(this.orientationControl.value)
                .subscribe({
                    complete: () => {
                        this._profile.sexual_orientation = this.orientationControl.value;
                        this._router.navigate(['complete-profile/avatar']);
                    },
                    error: (error) => {
                        console.error('Error:', error);
                    },
                });
        }
    }
}
