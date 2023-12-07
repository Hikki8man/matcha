import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { ProfileViewModel } from 'src/app/models/profile-view.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISocketService } from 'src/app/services/socket/isocket.service';
import { timeAgo } from 'src/app/utils/timeAgo';

@Component({
    selector: 'profile-viewers',
    templateUrl: './profile-viewers.component.html',
    styleUrls: ['./profile-viewers.component.scss'],
})
export class ProfileViewersComponent implements OnInit, OnDestroy {
    public HeartIconUrl: string = IconUrlEnum.HeartEmpty;
    public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };
    public Views: ProfileViewModel[] = [];
    private _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _socketService: ISocketService,
        private readonly _router: Router,
    ) {}

    ngOnInit(): void {
        this._profileService
            .viewList()
            .pipe(takeUntil(this._destroy$))
            .subscribe((views) => (this.Views = views));

        this._socketService
            .onProfileView()
            .pipe(
                takeUntil(this._destroy$),
                tap((view) => {
                    view.avatar = this._profileService.getAvatar(view.avatar);
                    view.time_ago = timeAgo(view.created_at);
                }),
            )
            .subscribe((view) => {
                this.Views.push(view);
            });
    }

    public redirectToProfile(view: ProfileViewModel): void {
        this._router.navigate([AppPathEnum.Profile, view.id]);
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}
