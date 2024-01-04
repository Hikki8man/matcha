import { Component, EventEmitter, Output } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';
import { IAuthenticationService } from 'src/app/services/authentication/iauthentication.service';

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

    constructor(
        private readonly _apiService: IApiService,
        private readonly _authenticationService: IAuthenticationService,
        private readonly _toast: HotToastService,
    ) {}

    public handleSubmit(event: any): void {
        if (event.target.files.length === 0) {
            return;
        }
        const reader = new FileReader();
        const file = event.target.files[0];

        let src = '';

        reader.onload = (e: any) => {
            src = e.target.result;
            console.log(src);
            
        };
        reader.readAsDataURL(file);

        const formData: FormData = new FormData();
        formData.append('photo', file, file.name);
        formData.append('photo_type', `avatar`);
        this._apiService
            .callApi<{ path: string } | undefined>('profile/edit/photo', 'POST', formData)
            .subscribe({
                next: (res) => {
                    this._authenticationService.profileValue!.avatar = res.path;
                    this.OnPhotoAdded.emit(res.path);
                },
                error: () => {
                    this._toast.error("Erreur lors de l'envoi de la photo", {
                        position: 'bottom-center',
                    });
                },
            });
    }
}
