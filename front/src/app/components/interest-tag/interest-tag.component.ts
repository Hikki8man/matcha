import { Component, Input } from '@angular/core';

@Component({
	selector: 'interest-tag',
	templateUrl: './interest-tag.component.html',
	styleUrls: ['./interest-tag.component.scss']
})
export class InterestTagComponent {

	@Input() public Name: string | null;
}
