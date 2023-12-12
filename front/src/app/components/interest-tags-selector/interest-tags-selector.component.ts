import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { Tag } from 'src/app/models/profile.model';
import { IProfileService } from 'src/app/services/profile/iprofile.service';

@Component({
	selector: 'interest-tags-selector',
	templateUrl: './interest-tags-selector.component.html',
	styleUrls: ['./interest-tags-selector.component.scss']
})
export class InterestTagsSelectorComponent implements OnInit {

	@Input()
	set SelectedTags(value: Tag[]) {
		this._selectedTags = [...value];
	}
	get SelectedTags(): Tag[] {
		return this._selectedTags;
	}
	public DisplayedTags: Tag[] = [];
	public IconCloseUrl: string = IconUrlEnum.Close;
	public IconCloseStyle: Record<string, string> = { width: '14px', height: '14px' };

	private _selectedTags: Tag[] = [];
	private _allTags: Tag[] = [];

	@Output() public SelectedTagsChange: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

	constructor(
		private readonly _profileService: IProfileService,
	) {
	}

	ngOnInit(): void {
		this._profileService.getAllTags().subscribe((tags) => {
			this._allTags = tags.filter((tag) => !this.SelectedTags.some((t) => t.id === tag.id));
			this.DisplayedTags = this._allTags;
		});
	}

	public handleTagSelected(tag: Tag): void {
		if (this.SelectedTags.length === 5) {
			return;
		}
		this.SelectedTags.push(tag);
		this._allTags = this._allTags.filter((t) => t.id !== tag.id);
		this.DisplayedTags = this.DisplayedTags.filter((t) => t.id !== tag.id);
		this.SelectedTagsChange.emit(this.SelectedTags);
	}

	public handleTagUnselected(tag: Tag): void {
		this._allTags.push(tag);
		this.DisplayedTags.push(tag);
		this.SelectedTags = this.SelectedTags.filter((t) => t.id !== tag.id);
		this.SelectedTagsChange.emit(this.SelectedTags);
	}

	public handleFilter(value: string): void {
		if (value.length < 2) {
			this.DisplayedTags = this._allTags;
			return;
		}
		this.DisplayedTags = this._allTags
			.filter((tag) => tag.name.toLowerCase().includes(value.toLowerCase()));
	}
}
