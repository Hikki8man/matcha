import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { Tag } from 'src/app/models/profile.model';

@Component({
	selector: 'select-tags-modal',
	templateUrl: './select-tags-modal.component.html',
	styleUrls: ['./select-tags-modal.component.scss']
})
export class SelectTagsModalComponent {

	public CloseIconUrl: string = IconUrlEnum.Close;
	public IconStyle: Record<string, string> = { display: 'flex', width: '24px', height: '24px', fill: 'var(--color-text-secondary)' };

	public SelectedTags: Tag[] = [];
	
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { SelectedTags: Tag[] },
		private readonly _dialogRef: MatDialogRef<SelectTagsModalComponent>
	) { }

	public handleClose(): void {
		this._dialogRef.close();
	}

	public handleSubmit(): void {
		this._dialogRef.close(this.SelectedTags);
	}

	public handleSelectedTagsChange(tags: Tag[]): void {
		this.SelectedTags = tags;
	}
}
