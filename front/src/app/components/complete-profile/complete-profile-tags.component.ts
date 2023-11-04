import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { ProfileModel, Tag } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
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
        private _profileService: IProfileService, // private _router: Router,
    ) {
        this._profile = _authenticationService.getProfile();
        this.tagsChosen = this._profile.tags;
    }

    async ngOnInit(): Promise<void> {
        void this._authenticationService;
        try {
            this.allTags = await this._profileService.getAllTags();
            this.allTags = this.allTags.filter(
                (tag) => !this.tagsChosen.some((pickedTag) => pickedTag.id === tag.id),
            );
            console.log(this.allTags);
        } catch (err) {
            console.log('error fetching tags', err);
        }
    }

    onAddTag(clickedTag: Tag) {
        this.allTags = this.allTags.filter((tag) => tag.id !== clickedTag.id);
        this.tagsChosen.push(clickedTag);
    }

    onRemoveTag(clickedTag: Tag) {
        this.tagsChosen = this.tagsChosen.filter((tag) => tag.id !== clickedTag.id);
        this.allTags.push(clickedTag);
    }

    async onSubmit() {
        console.log('on Submit');
        try {
            await this._profileService.editTags(this.tagsChosen);
            this._profile.tags = this.tagsChosen;
            // this._router.navigate(['complete-profile/gender']);
        } catch (err) {
            console.log('error', err);
        }
    }
}
