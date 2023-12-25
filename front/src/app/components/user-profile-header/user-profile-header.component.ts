import { Component, Input, OnInit } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

@Component({
    selector: 'user-profile-header',
    templateUrl: './user-profile-header.component.html',
    styleUrls: ['./user-profile-header.component.scss'],
})
export class UserProfileHeaderComponent implements OnInit {
    @Input() public UserId: number;
    public OtherUser: boolean = false;
    constructor(private readonly _authservice: IAuthenticationService) {}

    public ngOnInit(): void {
        if (this.UserId !== this._authservice.profileValue?.id) {
            this.OtherUser = true;
        }
    }

    public BackIconUrl: string = IconUrlEnum.ArrowBack;
    public IconStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px' };
}
