import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    template: `
        <label for="photo">Photo</label>
        <input type="file" name="photo" #fileInput (change)="selectFile($event)" />
        <div class="photo-preview" *ngIf="preview">
            <img [src]="preview.url" alt="Uploaded Photo" />
        </div>
    `,
})
export class CompleteProfileAvatarComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    public preview: { url: string } | undefined;
    public avatarControl: FormControl;

    constructor(
        private _authenticationService: IAuthenticationService,
        private _profileService: IProfileService,
        private _router: Router,
    ) {
        this.avatarControl = new FormControl<File | undefined>(undefined, this.validateAvatar);
    }

    ngOnInit(): void {
        void this._authenticationService;
    }

    selectFile(event: Event): void {
        console.log('fileinput', this.fileInput);
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            const file = inputElement.files[0];
            this.preview = { url: URL.createObjectURL(file) };
            this.avatarControl.setValue(file);
        } else {
            this.avatarControl.setValue(undefined);
            this.preview = undefined;
            this.fileInput.nativeElement.value = '';
        }
    }

    public validateAvatar(control: AbstractControl) {
        const photo = control.value as File;
        console.log('validator', photo);
        if (!photo) {
            return { required: true };
        }
        return null;
    }

    async onSubmit() {
        console.log('on Submit');
        if (this.avatarControl.valid) {
            try {
                await this._profileService.editAvatar(this.avatarControl.value);
                this.fileInput.nativeElement.value = '';
                this._router.navigate(['complete-profile/bio']);
            } catch (err) {
                console.log('error', err);
            }
        }
    }
}
