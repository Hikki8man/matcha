import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProfileCardModel } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnDestroy {

    public UserId: number;
    public ProfileCard: ProfileCardModel;
    public Loading: boolean = true;

    private _destroy$ = new Subject<boolean>();

    constructor(
        private readonly _route: ActivatedRoute,
        private readonly _profileService: IProfileService,
    ) {
        this.UserId = this._route.snapshot.params['id'];
        this._profileService
            .getById(this.UserId)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (card) => {
                    this.ProfileCard = card;
                },
                complete: () => (this.Loading = false),
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}
