import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
    public defaultAvatar = 'https://www.w3schools.com/howto/img_avatar.png';
    public Loading: boolean = true;
    public Profiles: PublicProfileModel[];

    private _subscriptions: Subscription[] = [];

    constructor(
        private _profileService: IProfileService,
        private _searchFilterService: ISearchFilterService,
    ) { }

    ngOnInit(): void {
        this._subscriptions.push(this._searchFilterService.filters.subscribe((filter) => {
            console.log('filter update: ', filter);
            this._subscriptions.push(this._profileService.getProfilesFiltered(filter).subscribe((profiles) => {
                this.Profiles = profiles;
                this.Loading = false;
            }));
        }));
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
