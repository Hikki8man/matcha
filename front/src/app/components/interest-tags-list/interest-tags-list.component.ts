import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/profile.model';

@Component({
    selector: 'interest-tags-list',
    templateUrl: './interest-tags-list.component.html',
    styleUrls: ['./interest-tags-list.component.scss'],
})
export class InterestTagsListComponent {
    @Input() public Tags: Tag[];
    @Input() public Selectable: boolean = false;

    @Output() public OnSelect: EventEmitter<Tag> = new EventEmitter<Tag>();

    public handleTagSelected(tag: Tag): void {
        if (this.Selectable) {
            this.OnSelect.emit(tag);
        }
    }
}
