import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/profile.model';

@Component({
    selector: 'interest-tag',
    templateUrl: './interest-tag.component.html',
    styleUrls: ['./interest-tag.component.scss'],
})
export class InterestTagComponent {
    @Input() public Tag: Tag;
}
