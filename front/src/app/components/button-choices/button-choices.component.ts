import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChoiceItem } from 'src/app/models/choice-item.model';

@Component({
	selector: 'button-choices',
	templateUrl: './button-choices.component.html',
	styleUrls: ['./button-choices.component.scss']
})
export class ButtonChoicesComponent {

	@Input() public Items: ChoiceItem[] = [];
	@Input()
	set DefaultItem(item: ChoiceItem) {
		this.SelectedItem = item;
	}
	public SelectedItem: ChoiceItem;

	@Output() public OnSelect: EventEmitter<ChoiceItem> = new EventEmitter<ChoiceItem>();

	public handleSelect(item: ChoiceItem) {
		this.SelectedItem = item;
		this.OnSelect.emit(item);
	}
}
