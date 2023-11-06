import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProfileModel, PublicProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
    constructor(
        private _apiService: IApiService,
        private _profileService: IProfileService,
    ) {}

    public defaultAvatar = 'https://www.w3schools.com/howto/img_avatar.png';
    public profiles$: Observable<PublicProfileModel[]> = this._apiService
        .callApi<ProfileModel[]>('profile', 'GET')
        .pipe(
            map((profiles) => {
                return profiles.map((profile) => ({
                    id: profile.id,
                    name: profile.name,
                    age: new Date().getFullYear() - new Date(profile.birth_date).getFullYear(),
                    bio: profile.bio,
                    avatar: this._profileService.getAvatar(profile.id),
                }));
            }),
        );
}
