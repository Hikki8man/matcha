import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'matcha-input',
    templateUrl: './matcha-input.component.html',
    styleUrls: ['./matcha-input.component.scss'],
})
export class MatchaInputComponent implements OnInit {

    @Input() public Placeholder: string = null;
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
    @Input() public HasError: boolean | undefined = false;
    @Input() public Value: any;
    @Input() public Disabled: boolean = false;
    @Input() public Title: string;

    @Output() public ValueChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() public OnFocusOut: EventEmitter<string> = new EventEmitter<string>();
    
    public InputFormControl: FormControl = new FormControl();
    public IsPassword: boolean = false;
    public IconVisibilityUrl: string = IconUrlEnum.VisibilityOff;
    public IconVisibilityStyle: Record<string, string> = {
        width: '18px',
        height: '18px',
        'margin-right': '4px',
        cursor: 'pointer',
        fill: 'var(--title-color)',
    };

    private _formGroup: FormGroup;

    ngOnInit(): void {
        this.IsPassword = this.Type === 'password';
    }

    public handlePasswordVisibilityChange(): void {
        this.IconVisibilityUrl = this.Type === 'password' ? IconUrlEnum.Visibility : IconUrlEnum.VisibilityOff;
        this.Type = this.Type === 'password' ? 'text' : 'password';
    }

    public handleFocusOut(): void {
        if (!this.FormGroup.get(this.Name)?.invalid) {
            this.OnFocusOut.emit(this.Value);
        }
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
