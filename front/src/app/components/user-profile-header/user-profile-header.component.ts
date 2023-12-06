import { Component, Input } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'user-profile-header',
	templateUrl: './user-profile-header.component.html',
	styleUrls: ['./user-profile-header.component.scss']
})
export class UserProfileHeaderComponent {

	@Input() public UserId: number

	public BackIconUrl: string = IconUrlEnum.ArrowBack;
	public IconStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px' };
}
