import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'matcha-input',
    templateUrl: './matcha-input.component.html',
    styleUrls: ['./matcha-input.component.scss'],
})
export class MatchaInputComponent {
    @Input() public Placeholder: string;
    @Input() public Type: string;
    @Input() public FormGroup: FormGroup;
    @Input() public Name: string;
}
