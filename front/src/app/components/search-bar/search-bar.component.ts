import { Component } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

	public Value: string;
	public SearchIconUrl: string = IconUrlEnum.Search;
	public SearchIconStyle: Record<string, string> = { display: 'flex', height: '22px', width: '22px' };
}
