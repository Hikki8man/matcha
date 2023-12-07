import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'matcha-button',
    templateUrl: './matcha-button.component.html',
    styleUrls: ['./matcha-button.component.scss'],
})
export class MatchaButtonComponent {
    @Input() Disabled: boolean = false;
    @Input() Label: string = '';
    @Input() Type: string = 'submit';

    @Output() public OnClick: EventEmitter<void> = new EventEmitter<void>();

    public handleClick(): void {
        this.OnClick.emit();
    }
}
