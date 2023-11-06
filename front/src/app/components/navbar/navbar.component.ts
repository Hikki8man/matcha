import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { NotificationType, Notification } from 'src/app/models/notification.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    public notifications: Notification[];
    public msgNotifications: Notification[];

    constructor(
        private _socket: Socket,
        private _apiService: ApiService,
    ) {
        this.notifications = [];
        this.msgNotifications = [];
    }

    ngOnInit(): void {
        this._apiService
            .callApi<Notification[]>('notification', 'GET')
            .pipe(
                map((notifs) => {
                    notifs.forEach((notif) => {
                        if (notif.type === NotificationType.Message) {
                            this.msgNotifications.push(notif);
                        } else {
                            this.notifications.push(notif);
                        }
                    });
                }),
            )
            .subscribe();

        this._socket.fromEvent<Notification>('NewNotification').subscribe((notification) => {
            if (notification.type === NotificationType.Message) {
                this.msgNotifications.push(notification);
            } else {
                this.notifications.push(notification);
            }
        });
    }

    public UserIconUrl: string = IconUrlEnum.User;
    public UsersIconUrl: string = IconUrlEnum.Users;
    public MessageIconUrl: string = IconUrlEnum.Message;
    public SettingsIconUrl: string = IconUrlEnum.Settings;

    public IconStyle: Record<string, string> = { display: 'flex', height: '22px', width: '22px' };

    public isCurrentPage(page: string): boolean {
        return window.location.href.includes(page);
    }
}
