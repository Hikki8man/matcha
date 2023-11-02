import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { CompletedSteps, ProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'app-complete-profile',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent implements OnInit {
    constructor(
        private _authenticationService: IAuthenticationService,
        private _profileService: IProfileService,
    ) {}

    private _profile: ProfileModel | null;

    public Photos: { url: string }[] = [];
    public Genders: GenderEnum[] = Object.values(GenderEnum);
    public CurrentStep: CompletedSteps;
    public CompleteForm: FormGroup;

    ngOnInit(): void {
        this.init();
    }

    private async init() {
        this._profile = this._authenticationService.getProfile();
        this.CurrentStep = this._profile?.completed_steps!;

        this.CompleteForm = new FormGroup({
            name: new FormControl(this._profile?.name, {
                validators: [Validators.required],
                nonNullable: true,
            }),
            gender: new FormControl<GenderEnum>(GenderEnum.Male, {
                validators: [Validators.required],
                nonNullable: true,
            }),
            photos: new FormControl<{ url: string }[]>([], {
                // validators: [this.validatePhotos],
            }),
            bio: new FormControl('', {
                validators: [Validators.required],
            }),
        });
    }

    public handleFileInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            for (let i = 0; i < inputElement.files.length; i++) {
                const file = inputElement.files[i];
                this.Photos.push({ url: URL.createObjectURL(file) });
            }
            this.CompleteForm.get('photos')?.setValue(this.Photos);
        }
    }

    public removePhoto(index: number) {
        this.Photos.splice(index, 1);
        this.CompleteForm.get('photos')?.setValue(this.Photos);
    }

    public validatePhotos(control: FormControl) {
        const photos = control.value as { url: string }[];
        if (photos.length < 1) {
            return { required: true };
        }
        return null;
    }

    public async nextStep() {
        // Implement the logic to move to the next step here
        switch (this.CurrentStep) {
            case CompletedSteps.Name:
                if (this.CompleteForm.get('name')?.valid) {
                    try {
                        await this._profileService.editName(this.CompleteForm.get('name')!.value);
                    } catch (err) {}
                    this.CurrentStep = CompletedSteps.Gender;
                }
                break;
            case CompletedSteps.Gender:
                if (this.CompleteForm.get('gender')?.valid) {
                    try {
                        await this._profileService.editGender(
                            this.CompleteForm.get('gender')!.value,
                        );
                        this.CurrentStep = CompletedSteps.Photo;
                    } catch (err) {}
                }
                break;
            case CompletedSteps.Photo:
                if (this.CompleteForm.get('photo')?.valid) {
                    this.CurrentStep = CompletedSteps.Bio;
                }
                break;
            case CompletedSteps.Bio:
                if (this.CompleteForm.get('bio')?.valid) {
                    this.CurrentStep = CompletedSteps.Completed;
                }
                break;
        }
    }
}
