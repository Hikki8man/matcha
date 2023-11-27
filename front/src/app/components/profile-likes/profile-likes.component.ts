import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { LikeType } from 'src/app/enums/like-type-enum';
import { LikeModel } from 'src/app/models/like.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { ISocketService } from 'src/app/services/socket/isocket.service';
import { timeAgo } from 'src/app/utils/timeAgo';

@Component({
    selector: 'profile-likes',
    templateUrl: './profile-likes.component.html',
    styleUrls: ['./profile-likes.component.scss'],
})
export class ProfileLikesComponent implements OnInit, OnDestroy {
    public Likes: LikeModel[] = [];
    private _likeEventSub: Subscription;

    constructor(
        private readonly _profileService: IProfileService,
        private readonly _socketService: ISocketService,
    ) {}

    ngOnInit(): void {
        void this._profileService;
        this._profileService.likerList().subscribe((likes) => (this.Likes = likes));
        this._likeEventSub = this._socketService
            .onLikeEvent()
            .pipe(
                tap((like) => {
                    if (like.type === LikeType.Like) {
                        like.user.avatar = this._profileService.getAvatar(like.user.id);
                        like.user.time_ago = timeAgo(like.user.created_at);
                    }
                }),
            )
            .subscribe((like) => {
                if (like.type === LikeType.Like) {
                    this.Likes.push(like.user);
                } else {
                    this.Likes = this.Likes.filter((l) => l.id !== like.user.id);
                }
            });
    }

    ngOnDestroy(): void {
        this._likeEventSub.unsubscribe();
    }

    public HeartIconUrl: string = IconUrlEnum.HeartEmpty;
    public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };
}
