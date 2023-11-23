import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'profile-viewers',
	templateUrl: './profile-viewers.component.html',
	styleUrls: ['./profile-viewers.component.scss']
})
export class ProfileViewersComponent {

	public Viewers: any[] = [
		{
			name: 'lolo',
			avatar: 'assets/images/detective_squirrel.png',
			date: 'Il y a 20 minutes'
		},
		{
			name: 'nico',
			avatar: 'assets/images/background.jpeg',
			date: 'Hier'
		},
		{
			name: 'jojo',
			avatar: 'assets/images/ronflex.jpeg',
			date: 'Hier'
		},
		{
			name: 'manu',
			avatar: 'assets/images/manuvolution.png',
			date: 'Il y a 2 jours'
		},
		{
			name: 'chacos',
			avatar: 'assets/images/aigri.jpeg',
			date: 'Il y a 1 semaine'
		}
	];

	public HeartIconUrl: string = IconUrlEnum.HeartEmpty;
	public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };
}
