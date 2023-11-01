import { Component, Input } from '@angular/core';

@Component({
    selector: 'matcha-button',
    templateUrl: './matcha-button.component.html',
    styleUrls: ['./matcha-button.component.scss'],
})
export class MatchaButtonComponent {
    @Input() Disabled: boolean = false;
    @Input() Label: string = '';
    @Input() Type: string = 'submit';
}
