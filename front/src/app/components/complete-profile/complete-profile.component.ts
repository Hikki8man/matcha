import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
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

    @ViewChild('fileInput') fileInput: ElementRef;
    private _profile: ProfileModel | null;

    public Preview: { url: string } | undefined;
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
            photo: new FormControl<File | undefined>(undefined, this.validatePhoto),
            bio: new FormControl('', {
                validators: [Validators.required],
            }),
        });
    }

    selectFile(event: Event): void {
        console.log('fileinput', this.fileInput);
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            const file = inputElement.files[0];
            this.Preview = { url: URL.createObjectURL(file) };
            this.CompleteForm.get('photo')?.setValue(file);
        } else {
            this.CompleteForm.get('photo')?.setValue(undefined);
            this.Preview = undefined;
            this.fileInput.nativeElement.value = '';
        }
    }

    public validatePhoto(control: AbstractControl) {
        const photo = control.value as File;
        console.log('validator', photo);
        if (!photo) {
            return { required: true };
        }
        return null;
    }

    public async nextStep() {
        switch (this.CurrentStep) {
            case CompletedSteps.Name:
                if (this.CompleteForm.get('name')?.valid) {
                    try {
                        console.log('value', this.CompleteForm.get('name')!.value);
                        await this._profileService.editName(this.CompleteForm.get('name')!.value);
                        this.CurrentStep = CompletedSteps.Gender;
                    } catch (err) {}
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
                    try {
                        const file: File = this.CompleteForm.get('photo')?.value;
                        await this._profileService.editAvatar(file);
                        this.fileInput.nativeElement.value = '';
                    } catch (err) {
                        console.log(err);
                    }
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
