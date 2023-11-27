import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { PublicProfileModel } from 'src/app/models/profile.model';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent implements OnInit, OnDestroy {
    @Input() public UserId: number;
    public IsOtherUser: boolean = false;
    public IsLiked: boolean = false;
    public Loading: boolean = true;
    public Profile: PublicProfileModel;
    private _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _authenticationService: IAuthenticationService,
    ) {}

    ngOnInit(): void {
        this._profileService
            .getById(this.UserId)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (card) => {
                    this.Profile = card.profile;
                    this.IsLiked = card.isLiked;
                },
                complete: () => (this.Loading = false),
            });
        this.IsOtherUser = this.UserId !== this._authenticationService.profileValue.id;
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };

    public handleLikeStatusChanged(isLiked: boolean) {
        this.IsLiked = isLiked;
        this._profileService.likeProfile(this.UserId).pipe(takeUntil(this._destroy$)).subscribe();
    }
}
