import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompletedSteps, Gender } from 'src/app/models/profile.model';
import { AuthService } from 'src/app/services/auth.sevice';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
    selector: 'app-complete-profile',
    templateUrl: './complete-profile.component.html',
    styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileComponent {
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _profileService: ProfileService,
    ) {}

    profile = this._authService.getAuth().profile;
    genders = Object.values(Gender);
    currentStep: CompletedSteps = this.profile.completed_steps;
    photos: { url: string }[] = [];
    CompleteForm = new FormGroup({
        name: new FormControl(this.profile.name, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        gender: new FormControl<Gender>(Gender.Male, {
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

    handleFileInput(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            for (let i = 0; i < inputElement.files.length; i++) {
                const file = inputElement.files[i];
                console.log('file: ', file);
                // You may want to handle the file (e.g., display a preview) before pushing it to the array.
                this.photos.push({ url: URL.createObjectURL(file) });
            }
            this.CompleteForm.get('photos')?.setValue(this.photos);
        }
    }

    removePhoto(index: number) {
        this.photos.splice(index, 1);
        this.CompleteForm.get('photos')?.setValue(this.photos);
    }

    validatePhotos(control: FormControl) {
        const photos = control.value as { url: string }[];
        if (photos.length < 1) {
            return { required: true };
        }
        return null;
    }

    nextStep() {
        // Implement the logic to move to the next step here
        switch (this.currentStep) {
            case CompletedSteps.Name:
                if (this.CompleteForm.get('name')?.valid) {
                    this._profileService
                        .editName(this.CompleteForm.get('name')!.value)
                        .subscribe(() => (this.currentStep = CompletedSteps.Gender));
                }
                break;
            case CompletedSteps.Gender:
                if (this.CompleteForm.get('gender')?.valid) {
                    this._profileService
                        .editGender(this.CompleteForm.get('gender')!.value)
                        .subscribe(() => (this.currentStep = CompletedSteps.Photo));
                }
                break;
            case CompletedSteps.Photo:
                if (this.CompleteForm.get('photo')?.valid) {
                    this.currentStep = CompletedSteps.Bio;
                }
                break;
            case CompletedSteps.Bio:
                if (this.CompleteForm.get('bio')?.valid) {
                    this.currentStep = CompletedSteps.Completed;
                }
                break;
        }
    }
}
