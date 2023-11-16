import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    public profiles$: Observable<PublicProfileModel[]>;
    public defaultAvatar = 'https://www.w3schools.com/howto/img_avatar.png';

    constructor(
        private _profileService: IProfileService,
        private _searchFilterService: ISearchFilterService,
    ) {}

    ngOnInit(): void {
        this._searchFilterService.filters.subscribe((filter) => {
            console.log('filter update: ', filter);
            this.profiles$ = this._profileService.getProfilesFiltered(filter);
        });
    }
}
