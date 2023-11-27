import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
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
                    view.avatar = this._profileService.getAvatar(view.id);
                    view.time_ago = timeAgo(view.created_at);
                }),
            )
            .subscribe((view) => {
                this.Views.push(view);
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}
