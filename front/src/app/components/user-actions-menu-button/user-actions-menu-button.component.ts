import { Component, Input } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'user-actions-menu-button',
	templateUrl: './user-actions-menu-button.component.html',
	styleUrls: ['./user-actions-menu-button.component.scss']
})
export class UserActionsMenuButtonComponent {

	@Input() public UserId: number;

	public MoreIconUrl: string = IconUrlEnum.More;
	public IconStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px' };
}
