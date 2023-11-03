import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'profile-likes',
	templateUrl: './profile-likes.component.html',
	styleUrls: ['./profile-likes.component.scss']
})
export class ProfileLikesComponent {

	public Likes: any[] = [
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
