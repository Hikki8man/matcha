import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Tag } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { LocationModalComponent } from '../../location-modal/location-modal.component';

@Component({
    selector: 'complete-criterias',
    templateUrl: './complete-criterias.component.html',
    styleUrls: ['./complete-criterias.component.scss'],
})
export class CompleteCriteriasComponent {
    public Tags: Tag[] = [];

    constructor(
        private readonly _authenticationService: IAuthenticationService,
        private readonly _profileService: IProfileService,
        private readonly _toastService: HotToastService,
        private readonly _dialog: MatDialog,
    ) {
        this.Tags = this._authenticationService.profileValue.tags;
    }

    public handleSelectedTagsChange(selectedTags: Tag[]): void {
        this.Tags = selectedTags;
    }

    public handleSubmit(): void {
        this._profileService.editTags(this.Tags).subscribe({
            complete: () => {
                this._dialog.open(LocationModalComponent, {
                    data: {
                        redirect: true,
                    },
                });
            },
            error: (error) => {
                this._toastService.error(error.error);
            },
        });
    }
}
