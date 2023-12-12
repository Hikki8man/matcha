import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'matcha-textarea',
    templateUrl: './matcha-textarea.component.html',
    styleUrls: ['./matcha-textarea.component.scss'],
})
export class MatchaTextAreaComponent {

    @Input() public Placeholder: string = null;
    @Input()
    get FormGroup(): FormGroup {
        return this._formGroup;
    }
    set FormGroup(formGroup: FormGroup) {
        this._formGroup = formGroup;
        this.init();
    }
    @Input() public Name: string;
    @Input() public HasError: boolean | undefined = false;
    @Input() public Value: any;
    @Input() public Disabled: boolean = false;
    @Input() public Title: string;

    @Output() public ValueChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() public OnFocusOut: EventEmitter<string> = new EventEmitter<string>();

    public InputFormControl: FormControl = new FormControl();
    public IconVisibilityUrl: string = IconUrlEnum.VisibilityOff;
    public IconVisibilityStyle: Record<string, string> = {
        width: '18px',
        height: '18px',
        'margin-right': '4px',
        cursor: 'pointer',
        fill: 'var(--title-color)',
    };

    private _formGroup: FormGroup;

    public handleFocusOut(): void {
        this.OnFocusOut.emit(this.Value);
    }

    public handleValueChange(event: Event): void {
        this.Value = (event.target as any).value;
        this.ValueChange.emit(this.Value);
    }

    private init(): void {
        if (this.FormGroup) {
            (this.InputFormControl as any) = this.FormGroup.controls[this.Name];
        }
    }
}
