import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { FiltersModel } from 'src/app/models/filters.model';
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
    public ItemCount: number;
    public ItemsPerPage: number;
    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };
    public Filters: FiltersModel;

    private _destroy$ = new Subject<boolean>();

    constructor(
        private _profileService: IProfileService,
        private _searchFilterService: ISearchFilterService,
    ) {}

    ngOnInit(): void {
        this._searchFilterService.filters.pipe(takeUntil(this._destroy$)).subscribe((filter) => {
            this.Loading = true;
            window.scrollTo({ top: 0 });
            this._profileService
                .getProfilesFiltered(filter)
                .pipe(takeUntil(this._destroy$))
                .subscribe((searchResult) => {
                    this.Profiles = searchResult.profiles;
                    this.ItemCount = searchResult.count;
                    this.ItemsPerPage = searchResult.limit;
                    this.Loading = false;
                });
        });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    public trimBio(bio: string): string {
        if (!bio) return '';
        if (bio.length >= 80) {
            return bio.slice(0, 78) + '...';
        }
        return bio;
    }
}
