import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPathEnum } from 'src/app/enums/app-path-enum';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { Notification, NotificationType } from 'src/app/models/notification.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { timeAgo } from 'src/app/utils/timeAgo';

@Component({
    selector: 'notifications-list-item',
    templateUrl: './notifications-list-item.component.html',
    styleUrls: ['./notifications-list-item.component.scss'],
})
export class NotificationsListItemComponent implements OnInit {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public BrokenHeartIconUrl: string = IconUrlEnum.BrokenHeart;
    public VisibilityIconUrl: string = IconUrlEnum.Visibility;
    public IconStyle: Record<string, string> = {
        display: 'flex',
        height: '24px',
        width: '24px',
        fill: 'var(--title-color)',
    };

    public UserName: string;
    public Details: string;
    public TimeAgo: string;

    private _type = {
        [NotificationType.Like]: 'a liké ton profil',
        [NotificationType.Match]: 'a match avec vous',
        [NotificationType.unMatch]: 'a unmatch avec vous',
        [NotificationType.View]: 'a visité ton profil',
        [NotificationType.Message]: '',
    };
    private _icon = {
        [NotificationType.Like]: this.HeartIconUrl,
        [NotificationType.Match]: this.HeartIconUrl,
        [NotificationType.unMatch]: this.BrokenHeartIconUrl,
        [NotificationType.View]: this.VisibilityIconUrl,
        [NotificationType.Message]: '',
    };
    public AvatarUrl: string = null;

    @Input() public Notification: Notification;

    constructor(
        private readonly _router: Router,
        private readonly _profileService: IProfileService,
    ) {}

    ngOnInit(): void {
        this.UserName = this.Notification.sender.name;
        this.Details = this._type[this.Notification.type];
        this.AvatarUrl = this._profileService.getAvatar(this.Notification.sender.avatar);
        this.TimeAgo = timeAgo(this.Notification.created_at);
    }

    public getIcon(): string {
        return this._icon[this.Notification.type];
    }

    public redirectToProfile(): void {
        this._router.navigate([AppPathEnum.Profile, this.Notification.sender.id]);
    }
}
