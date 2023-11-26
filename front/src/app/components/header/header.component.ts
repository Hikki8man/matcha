import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    public HeartIconUrl: string = IconUrlEnum.Heart;
    public HeartIconStyle: Record<string, string> = {
        display: 'flex',
        height: '14px',
    };
    public AvatarUrl: string = 'assets/images/becoshy.png';
}
