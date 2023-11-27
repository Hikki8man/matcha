import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
    };
    public AvatarUrl: string = null;

    private _subscription: Subscription;

    constructor(
        private readonly _authenticationService: IAuthenticationService,
        private readonly _profileService: IProfileService,
    ) {}

    ngOnInit(): void {
        const userId = this._authenticationService.profileValue.id;
        this._subscription = this._profileService.getAvatar(userId).subscribe((avatar) => {
            this.AvatarUrl = avatar;
        });
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
