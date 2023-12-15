import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { AccountModel } from 'src/app/models/account.model';
import { PublicProfileModel, Tag } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { SelectTagsModalComponent } from '../select-tags-modal/select-tags-modal.component';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { ChoiceItem } from 'src/app/models/choice-item.model';
import { GenderEnum } from 'src/app/enums/gender-enum';
import { SexualOrientation } from 'src/app/enums/sexual-orientation-enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'settings-form',
    templateUrl: './settings-form.component.html',
    styleUrls: ['./settings-form.component.scss'],
})
export class SettingsFormComponent {
    public Profile: PublicProfileModel;
    public Account: AccountModel;
    public Loading: boolean = true;
    public Orientation: SexualOrientation;
    public Gender: GenderEnum;
    public FormGroup: FormGroup;

    public IconEditUrl: string = IconUrlEnum.Edit;
    public IconStyle: Record<string, string> = { display: 'flex', width: '16px', height: '16px' };

    public GenderChoices: ChoiceItem[] = [
        new ChoiceItem('Homme', GenderEnum.Male),
        new ChoiceItem('Femme', GenderEnum.Female),
        new ChoiceItem('Autre', GenderEnum.Other),
    ];
    public OrientationItems: ChoiceItem[] = [
        new ChoiceItem('Heterosexuel', SexualOrientation.Heterosexual),
        new ChoiceItem('Homosexuel', SexualOrientation.Homosexual),
        new ChoiceItem('Bisexuel', SexualOrientation.Bisexual),
    ];

    constructor(
        private readonly _apiServive: IApiService,
        private readonly _authenticationService: IAuthenticationService,
        private readonly _profileService: IProfileService,
        private readonly _toast: HotToastService,
        private readonly _dialog: MatDialog,
        private readonly _formBuilder: FormBuilder,
    ) {
        this._apiServive.callApi<AccountModel>(`account`, 'GET').subscribe((res: AccountModel) => {
            this.Account = res;
            this._profileService.getById(this._authenticationService.profileValue.id).subscribe({
                next: (card) => {
                    this.Profile = card.profile;
                    this.Gender = this.Profile.gender;
                    this.Orientation = this.Profile.sexual_orientation;
                    this.FormGroup = this._formBuilder.group({
                        firstName: [this.Account.firstname, [Validators.required]],
                        lastName: [this.Account.lastname, [Validators.required]],
                        email: [this.Account.email, [Validators.required, Validators.email]],
                        displayName: [this.Profile.name, [Validators.required]],
                        bio: [this.Profile.bio, []],
                        userName: [this.Profile.name, [Validators.required]],
                    });
                },
                complete: () => {
                    this.Loading = false;
                },
            });
        });
    }

    public openTagsSelectionModal(): void {
        const dialog = this._dialog.open(SelectTagsModalComponent, {
            width: '600px',
            autoFocus: false,
            data: {
                SelectedTags: this.Profile.tags,
            },
        });
        dialog.afterClosed().subscribe((tags) => {
            if (tags) this.handleSelectedTagsChanged(tags);
        });
    }

    public handleBioChanged(bio: string): void {
        if (bio === this.Profile.bio) return;
        this._profileService.editBio(bio).subscribe({
            complete: () => {
                this.Profile.bio = bio;
                this._toast.success('Bio mise à jour', { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error('Erreur lors de la mise à jour de la bio', {
                    position: 'bottom-center',
                });
            },
        });
    }

    public handleSelectedTagsChanged(tags: Tag[]): void {
        if (tags === this.Profile.tags) return;
        this._profileService.editTags(tags).subscribe({
            complete: () => {
                this.Profile.tags = tags;
                this._toast.success('Tags mis à jour', { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error('Erreur lors de la mise à jour des tags', {
                    position: 'bottom-center',
                });
            },
        });
    }

    public handleDisplayNameChanged(displayName: string): void {
        if (displayName === this.Profile.name) return;
        this._profileService.editName(displayName).subscribe({
            complete: () => {
                this.Profile.name = displayName;
                this._toast.success("Nom d'affichage mis à jour", { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error("Erreur lors de la mise à jour du nom d'affichage", {
                    position: 'bottom-center',
                });
            },
        });
    }

    public handleUserNameChanged(username: string): void {
        if (username === this.Account.username) return;
        this._apiServive.callApi('account/edit/username', 'POST', { username }).subscribe({
            complete: () => {
                this.Account.username = username;
                this._toast.success("Nom d'utilisateur mis à jour", { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error("Erreur lors de la mise à jour de l'username", {
                    position: 'bottom-center',
                });
                this.FormGroup.controls['userName'].setValue(this.Account.username);
            },
        });
    }

    public handleEmailChanged(email: string): void {
        console.log(email);

        if (email === this.Account.email) return;
        if (confirm('En changeant ton email, tu vas être déconnecté. Continuer ?')) {
            this._apiServive.callApi('account/edit/email', 'POST', { email }).subscribe({
                complete: () => {
                    this.Account.email = email;
                    this._toast.success('Email mis à jour', { position: 'bottom-center' });
                },
                error: (_) => {
                    this._toast.error("Erreur lors de la mise à jour de l'email", {
                        position: 'bottom-center',
                    });
                    this.FormGroup.controls['email'].setValue(this.Account.email);
                },
            });
        } else {
            this.FormGroup.controls['email'].setValue(this.Account.email);
        }
    }

    public handleFirstNameChanged(firstname: string): void {
        if (firstname === this.Account.firstname) return;
        this._apiServive.callApi('account/edit/firstname', 'POST', { firstname }).subscribe({
            complete: () => {
                this.Account.firstname = firstname;
                this._toast.success('Prénom mis à jour', { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error('Erreur lors de la mise à jour du prénom', {
                    position: 'bottom-center',
                });
                this.FormGroup.controls['firstName'].setValue(this.Account.firstname);
            },
        });
    }

    public handleLastNameChanged(lastname: string): void {
        if (lastname === this.Account.lastname) return;
        this._apiServive.callApi('account/edit/lastname', 'POST', { lastname }).subscribe({
            complete: () => {
                this.Account.lastname = lastname;
                this._toast.success('Nom mis à jour', { position: 'bottom-center' });
            },
            error: (_) => {
                this._toast.error('Erreur lors de la mise à jour du nom', {
                    position: 'bottom-center',
                });
                this.FormGroup.controls['lastName'].setValue(this.Account.lastname);
            },
        });
    }

    public handleLocateClick(): void {
        this._dialog.open(LocationModalComponent, {
            data: {
                redirect: false,
            },
            width: '600px',
            autoFocus: false,
        });
    }

    public updateOrientation(choice: ChoiceItem) {
        this.Orientation = Object.values(SexualOrientation).find((x) => x == choice.Value);
    }

    public getSelectedOrientationItem(): ChoiceItem {
        return this.OrientationItems.find((x) => x.Value === this.Orientation);
    }

    public updateGender(choice: ChoiceItem) {
        this.Gender = Object.values(GenderEnum).find((x) => x == choice.Value);
    }

    public getSelectedGenderItem(): ChoiceItem {
        return this.GenderChoices.find((x) => x.Value === this.Gender);
    }

    public submitOrientation(): void {
        this._profileService.editOrientation(this.Orientation).subscribe({
            complete: () => {
                this._toast.success('Orientation mise à jour', { position: 'bottom-center' });
            },
            error: (error) => {
                this._toast.error(error.error);
            },
        });
    }

    public submitGender(): void {
        this._profileService.editGender(this.Gender).subscribe({
            complete: () => {
                this._toast.success('Genre mis à jour', { position: 'bottom-center' });
            },
            error: (error) => {
                this._toast.error(error.error);
            },
        });
    }
}
