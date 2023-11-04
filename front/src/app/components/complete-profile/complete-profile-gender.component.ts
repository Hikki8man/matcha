import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { ProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    template: `
        <label for="gender">Gender</label>
        <select id="gender" [formControl]="genderControl">
            <option [value]="gender" *ngFor="let gender of genders">{{ gender }}</option>
        </select>
        <button (click)="onSubmit()">Next</button>
    `,
})
export class CompleteProfileGenderComponent implements OnInit {
    private _profile: ProfileModel;

    public genderControl: FormControl;
    public genders: GenderEnum[] = Object.values(GenderEnum);

    constructor(
        private _authenticationService: IAuthenticationService,
        private _profileService: IProfileService,
        private _router: Router,
    ) {
        this._profile = _authenticationService.getProfile();
        this.genderControl = new FormControl<GenderEnum>(GenderEnum.Male, {
            validators: [Validators.required],
            nonNullable: true,
        });
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    async onSubmit() {
        console.log('on Submit');
        if (this.genderControl.valid) {
            try {
                await this._profileService.editGender(this.genderControl.value);
                this._profile.gender = this.genderControl.value;
                this._router.navigate(['complete-profile/avatar']);
            } catch (err) {
                console.log('error', err);
            }
        }
    }
}
