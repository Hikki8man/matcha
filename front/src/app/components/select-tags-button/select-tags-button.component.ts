import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { SelectTagsModalComponent } from '../select-tags-modal/select-tags-modal.component';
import { Tag } from 'src/app/models/profile.model';

@Component({
	selector: 'select-tags-button',
	templateUrl: './select-tags-button.component.html',
	styleUrls: ['./select-tags-button.component.scss']
})
export class SelectTagsButtonComponent {

	public IconAddUrl: string = IconUrlEnum.Add;
	public IconStyle: Record<string, string> = { display: 'flex', width: '24px', height: '24px' };
	@Input() public SelectedTags: Tag[] = [];

	@Output() public SelectedTagsChange: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

	constructor(
		private readonly _dialog: MatDialog
	) { }

	public handleClick(): void {
		const dialog = this._dialog.open(
			SelectTagsModalComponent,
			{
				width: '600px',
				autoFocus: false,
				data: {
					SelectedTags: this.SelectedTags,
				}
			}
		);
		dialog.afterClosed().subscribe((tags) => {
			if (tags)
				this.SelectedTagsChange.emit(tags);
		});
	}
}
