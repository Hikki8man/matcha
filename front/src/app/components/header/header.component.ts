import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    public NotificationIconUrl: string = IconUrlEnum.Notification;
    public NotificationIconStyle: Record<string, string> = {
        display: 'flex',
        height: '26px',
        width: '26px',
        fill: 'var(--color-pink-accent)',
    };
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
    };
    public HasNotifications: boolean = true;
    public AvatarUrl: string = 'assets/images/becoshy.png';

	public showNotifications() {
		this.HasNotifications = !this.HasNotifications;
	}
}
