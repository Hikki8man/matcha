import { Component, EventEmitter, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
    selector: 'avatar-select',
    templateUrl: './avatar-select.component.html',
    styleUrls: ['./avatar-select.component.scss'],
})
export class AvatarSelectComponent {
    @Output() public OnPhotoAdded: EventEmitter<string> = new EventEmitter<string>();

    public IconAddUrl: string = IconUrlEnum.Add;
    public IconAddStyle: Record<string, string> = {
        width: '50%',
        height: '50%',
        display: 'flex',
    };

    constructor(private readonly _profileService: IProfileService) {}

    public handleSubmit(event: any): void {
        if (event.target.files.length === 0) {
            return;
        }
        const reader = new FileReader();
        const file = event.target.files[0];

        let src = '';

        reader.onload = (e: any) => {
            src = e.target.result;
        };
        reader.readAsDataURL(file);

        this._profileService.editAvatar(file).subscribe({
            complete: () => {
                this.OnPhotoAdded.emit(src);
            },
            error: (error) => {
                console.error('Error:', error);
            },
        });
    }
}
