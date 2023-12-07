import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/profile.model';

@Component({
    selector: 'interest-tag',
    templateUrl: './interest-tag.component.html',
    styleUrls: ['./interest-tag.component.scss'],
})
export class InterestTagComponent {
    @Input() public Tag: Tag;
    @Input() public Selectable: boolean = false;

    @Output() public OnSelect: EventEmitter<Tag> = new EventEmitter<Tag>();

    public handleSelect(): void {
        if (this.Selectable)
            this.OnSelect.emit(this.Tag);
    }
}
