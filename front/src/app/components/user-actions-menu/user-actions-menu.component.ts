import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';

@Component({
    selector: 'user-actions-menu',
    templateUrl: './user-actions-menu.component.html',
    styleUrls: ['./user-actions-menu.component.scss'],
})
export class UserActionsMenuComponent {
    @Input() public UserId: number;

    public IconFlagUrl: string = IconUrlEnum.Flag;
    public IconBlockUrl: string = IconUrlEnum.Block;
    public IconStyle: Record<string, string> = { display: 'flex', height: '16px', width: '16px' };

    constructor(
        private readonly _apiService: IApiService,
        private readonly _dialog: MatDialog
    ) { }

    public onBlock(): void {
        this._apiService.callApi(`profile/block/${this.UserId}`, 'GET').subscribe();
    }

    public onReport(): void {
        const dialogRef = this._dialog.open(ReportModalComponent, {
            width: '600px',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((reason: string) => {
            console.log(reason);
        });
    }
}
