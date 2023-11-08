import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';

@Component({
    template: `
        <input type="text" [formControl]="nameControl" />
        <button (click)="onSubmit()">Next</button>
    `,
})
export class CompleteProfileNameComponent implements OnInit {
    private _profile: ProfileModel;

    public nameControl: FormControl;
    constructor(
        private _authenticationService: IAuthenticationService,
        private _completeProfileService: ICompleteProfileService,
        private _router: Router,
    ) {
        this._profile = _authenticationService.profileValue!;
        this.nameControl = new FormControl(this._profile.name, {
            validators: [Validators.required],
            nonNullable: true,
        });
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    onSubmit() {
        console.log('on Submit');
        if (this.nameControl.valid) {
            this._completeProfileService.completeName(this.nameControl.value).subscribe({
                complete: () => {
                    this._profile.name = this.nameControl.value;
                    this._router.navigate(['complete-profile/gender']);
                },
                error: (error) => {
                    console.error('Error:', error);
                },
            });
        }
    }
}
