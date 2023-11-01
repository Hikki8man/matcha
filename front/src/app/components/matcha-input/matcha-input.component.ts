import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'matcha-input',
    templateUrl: './matcha-input.component.html',
    styleUrls: ['./matcha-input.component.scss'],
})
export class MatchaInputComponent {

    @Input() public Placeholder: string;
    @Input() public Type: string;
    @Input()
    get FormGroup(): FormGroup {
        return this._formGroup;
    }
    set FormGroup(formGroup: FormGroup) {
        this._formGroup = formGroup;
        this.init();
    }
    @Input() public Name: string;
    
    public InputFormControl: FormControl = new FormControl();

    private _formGroup: FormGroup;

    private init(): void {
        if (this.FormGroup) {
            (this.InputFormControl as any) = this.FormGroup.controls[this.Name];
        }
    }
}
