import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { LikeModel } from 'src/app/models/like.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'profile-likes',
    templateUrl: './profile-likes.component.html',
    styleUrls: ['./profile-likes.component.scss'],
})
export class ProfileLikesComponent implements OnInit {
    public Likes$: Observable<LikeModel[]>;

    constructor(private readonly profileService: IProfileService) {}

    ngOnInit(): void {
        void this.profileService;
        this.Likes$ = this.profileService.likerList();
    }

    public HeartIconUrl: string = IconUrlEnum.HeartEmpty;
    public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };
}
