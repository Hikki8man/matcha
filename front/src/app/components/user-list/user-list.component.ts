import { Component, OnInit } from '@angular/core';
import { ProfileModel } from 'src/app/models/profile.model';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
    constructor(private _apiService: IApiService) {
        // this.Users = this.getUsers()
    }
    ngOnInit(): void {
        // console.log('isAuth: ', this._authenticationService.getAuth());
        this._apiService
            .callApi<ProfileModel[]>('profile', 'GET')
            .then((profiles: ProfileModel[]) => {
                this.Users = profiles.map((profile) => {
                    return {
                        id: profile.id,
                        name: profile.name,
                        age: new Date().getFullYear() - new Date(profile.birth_date).getFullYear(),
                        avatar: 'https://www.w3schools.com/howto/img_avatar.png',
                        bio: profile.bio,
                    };
                });
            });
    }
    public Users: any = [
        {
            name: 'lolo',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: 'bonjour à tous',
            age: 25,
        },
        {
            name: 'titouan',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: "salut c'est titouan",
            age: 25,
        },
        {
            name: 'toto',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: 'toto est content',
            age: 22,
        },
        {
            name: 'tata',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: 'tata est triste',
            age: 19,
        },
        {
            name: 'titi',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: 'titi est fatigué',
            age: 36,
        },
        {
            name: 'tutu',
            avatar: 'https://www.w3schools.com/howto/img_avatar.png',
            bio: 'tutu est malade',
            age: 45,
        },
    ];
}
