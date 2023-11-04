import { Component, OnInit } from '@angular/core';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    constructor(
        private _apiService: IApiService,
        private _profileService: IProfileService,
    ) {}

    public Users: any = [];
    async ngOnInit(): Promise<void> {
        try {
            const profiles = await this._apiService.callApi<ProfileModel[]>('profile', 'GET');
            const avatarPromises = profiles.map(async (profile) => {
                try {
                    const avatar = await this._profileService.getAvatar(profile.id);
                    return avatar;
                } catch (err) {
                    console.log('Error getting avatar for profile', profile.id, err);
                    return 'https://www.w3schools.com/howto/img_avatar.png'; // Default avatar URL
                }
            });
            const avatars = await Promise.all(avatarPromises);

            this.Users = profiles.map((profile, index) => ({
                id: profile.id,
                name: profile.name,
                age: new Date().getFullYear() - new Date(profile.birth_date).getFullYear(),
                avatar: avatars[index],
                bio: profile.bio,
            }));
        } catch (error) {
            console.error('Error fetching user profiles', error);
        }
    }
}
