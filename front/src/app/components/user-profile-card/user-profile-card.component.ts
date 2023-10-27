import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { AuthService } from 'src/app/services/auth.sevice';

@Component({
    selector: 'user-profile-card',
    templateUrl: './user-profile-card.component.html',
    styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
    constructor(private _authService: AuthService) {
        const profile = this._authService.getAuth().profile;
        this.UserName = profile.name;
    }
    public ProfileImage: string = 'assets/images/becoshy.png';
    public UserName: string = 'beco';
    public UserBio: string = 'trop shy pour faire une bio 👉👈';
    public UserTags: string[] = ['Shy', 'Cute', 'Becoshy', 'Bien sur', 'Gaëlle?', 'Quoi?'];
    public UserLocation: string = 'Lyon, France';
    public IsOnline: boolean = true;

    public LocationIconUrl: string = IconUrlEnum.Location;
    public LocationIconStyle: Record<string, string> = { display: 'flex', height: '16px' };
}
