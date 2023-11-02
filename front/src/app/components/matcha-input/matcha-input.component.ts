import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'matcha-input',
    templateUrl: './matcha-input.component.html',
    styleUrls: ['./matcha-input.component.scss'],
})
export class MatchaInputComponent implements OnInit {

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
    @Input() public HasError: boolean | undefined = false;
    
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

    private init(): void {
        if (this.FormGroup) {
            (this.InputFormControl as any) = this.FormGroup.controls[this.Name];
        }
    }
}
