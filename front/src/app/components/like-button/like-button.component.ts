import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'like-button',
    templateUrl: './like-button.component.html',
    styleUrls: ['./like-button.component.scss'],
})
export class LikeButtonComponent {
    @Input() public Liked: boolean = false;
    @Output() public LikeStatusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    public HeartIconUrl: string = IconUrlEnum.HeartEmpty;
    public HeartFullIconUrl: string = IconUrlEnum.Heart;
    public IconStyle: Record<string, string> = { display: 'flex', height: '30px', width: '30px' };

    public handleClick() {
        this.Liked = !this.Liked;
        this.LikeStatusChanged.emit(this.Liked);
    }
}
