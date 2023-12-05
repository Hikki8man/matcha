import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISearchFilterService } from 'src/app/services/search-filter/isearch-filter.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
    public Loading: boolean = true;
    public Profiles: PublicProfileModel[];
    private _destroy$ = new Subject<boolean>();

    constructor(
        private _profileService: IProfileService,
        private _searchFilterService: ISearchFilterService,
    ) {}

    ngOnInit(): void {
        this._searchFilterService.filters.pipe(takeUntil(this._destroy$)).subscribe((filter) => {
            console.log('filter update: ', filter);
            this._profileService
                .getProfilesFiltered(filter)
                .pipe(takeUntil(this._destroy$))
                .subscribe((profiles) => {
                    this.Profiles = profiles;
                    this.Loading = false;
                });
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}
