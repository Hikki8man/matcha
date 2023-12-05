import { Component, Input } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'user-actions-menu',
	templateUrl: './user-actions-menu.component.html',
	styleUrls: ['./user-actions-menu.component.scss']
})
export class UserActionsMenuComponent {

	@Input() public UserId: number;

	public IconFlagUrl: string = IconUrlEnum.Flag;
	public IconBlockUrl: string = IconUrlEnum.Block;
	public IconStyle: Record<string, string> = { display: 'flex', height: '16px', width: '16px' };
}
