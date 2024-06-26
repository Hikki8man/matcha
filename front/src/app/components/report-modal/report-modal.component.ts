import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
    selector: 'report-modal',
    templateUrl: './report-modal.component.html',
    styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent {
    public CloseIconUrl: string = IconUrlEnum.Close;
    public IconStyle: Record<string, string> = {
        display: 'flex',
        width: '24px',
        height: '24px',
        fill: 'var(--color-text-secondary)',
    };

    public FormGroup: FormGroup;
    public HasErrors: boolean = false;

    constructor(
        private readonly _dialogRef: MatDialogRef<ReportModalComponent>,
        private readonly _formBuilder: FormBuilder,
    ) {
        this.FormGroup = this._formBuilder.group({
            reason: ['', [Validators.required]],
        });
    }

    public handleClose(): void {
        this._dialogRef.close();
    }

    public handleSubmit(): void {
        this.HasErrors = !this.FormGroup.valid;
        if (this.HasErrors) return;

        this._dialogRef.close(this.FormGroup.get('reason').value);
    }
}
