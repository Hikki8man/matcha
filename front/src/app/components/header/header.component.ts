import { Component, OnInit } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
        width: '14px',
    };
    public AvatarUrl: string = null;

    constructor(
        private readonly _authenticationService: IAuthenticationService,
        private readonly _profileService: IProfileService,
    ) {}

    ngOnInit(): void {
        this.AvatarUrl = this._profileService.getAvatar(
            this._authenticationService.profileValue.avatar,
        );
    }
}
