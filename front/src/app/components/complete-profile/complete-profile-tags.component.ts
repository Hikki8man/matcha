import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileModel, Tag } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { ICompleteProfileService } from 'src/app/services/complete-profile/icomplete-profile.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    template: `
        <div class="tag-picked-container">
            <div *ngFor="let tag of tagsChosen">
                <interest-tag [Tag]="tag" (click)="onRemoveTag(tag)"></interest-tag>
            </div>
        </div>
        <div class="tags-container">
            <div *ngFor="let tag of allTags">
                <interest-tag [Tag]="tag" (click)="onAddTag(tag)"></interest-tag>
            </div>
        </div>
        <button (click)="onSubmit()">Next</button>
    `,
    styleUrls: ['./complete-profile.component.scss'],
})
export class CompleteProfileTagsComponent implements OnInit {
    private _profile: ProfileModel;

    public tagsChosen: Tag[];
    public allTags: Tag[] = [];
    constructor(
        private _authenticationService: IAuthenticationService,
        private _profileService: IProfileService,
        private _completeProfileService: ICompleteProfileService,
        private _router: Router,
    ) {
        this._profile = _authenticationService.getProfile();
        this.tagsChosen = this._profile.tags;
    }

    async ngOnInit(): Promise<void> {
        void this._authenticationService;
        this._profileService.getAllTags().subscribe((tags) => (this.allTags = tags));
    }

    onAddTag(clickedTag: Tag) {
        this.allTags = this.allTags.filter((tag) => tag.id !== clickedTag.id);
        this.tagsChosen.push(clickedTag);
    }

    onRemoveTag(clickedTag: Tag) {
        this.tagsChosen = this.tagsChosen.filter((tag) => tag.id !== clickedTag.id);
        this.allTags.push(clickedTag);
    }

    onSubmit() {
        console.log('on Submit');
        this._completeProfileService.completeAvatar(this.tagsChosen).subscribe({
            complete: () => {
                this._profile.tags = this.tagsChosen;
                this._router.navigate(['complete-profile/bio']);
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }
}
