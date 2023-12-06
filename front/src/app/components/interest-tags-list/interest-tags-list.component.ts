import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/profile.model';

@Component({
	selector: 'interest-tags-list',
	templateUrl: './interest-tags-list.component.html',
	styleUrls: ['./interest-tags-list.component.scss']
})
export class InterestTagsListComponent {

	@Input() public Tags: Tag[];
}
