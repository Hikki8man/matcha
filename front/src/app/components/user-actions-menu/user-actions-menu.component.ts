import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { IProfileService } from 'src/app/services/profile/iprofile.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
    selector: 'user-actions-menu',
    templateUrl: './user-actions-menu.component.html',
    styleUrls: ['./user-actions-menu.component.scss'],
})
export class UserActionsMenuComponent {
    @Input() public UserId: number;
    @Input() public AllowUnmatch: boolean = false;

    public IconFlagUrl: string = IconUrlEnum.Flag;
    public IconBlockUrl: string = IconUrlEnum.Block;
    public IconBrokenHeartUrl: string = IconUrlEnum.BrokenHeart;
    public IconStyle: Record<string, string> = { display: 'flex', height: '16px', width: '16px' };

    constructor(
        private readonly _apiService: IApiService,
        private readonly _dialog: MatDialog,
        private readonly _profileService: IProfileService,
        private readonly _toast: HotToastService,
    ) {}

    public onBlock(): void {
        this._apiService.callApi(`profile/block/${this.UserId}`, 'GET').subscribe();
    }

    public onReport(): void {
        const dialogRef = this._dialog.open(ReportModalComponent, {
            width: '600px',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((reason: string) => {
            if (!reason) return;
            this._apiService
                .callApi(`profile/report`, 'POST', { id: +this.UserId, reason })
                .subscribe((_) => {
                    this._toast.success('Ton signalement a bien été pris en compte', {
                        position: 'bottom-center',
                    });
                });
        });
    }

    public onUnmatch(): void {
        this._profileService.likeProfile(this.UserId).subscribe();
    }
}
