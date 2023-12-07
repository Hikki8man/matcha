import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'report-modal',
	templateUrl: './report-modal.component.html',
	styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent {

	public CloseIconUrl: string = IconUrlEnum.Close;
	public IconStyle: Record<string, string> = { display: 'flex', width: '24px', height: '24px', fill: 'var(--color-text-secondary)' };

	public FormGroup: FormGroup;
	public HasErrors: boolean = false;

	constructor(
		private readonly _dialogRef: MatDialogRef<ReportModalComponent>,
		private readonly _formBuilder: FormBuilder,
		private readonly _toast: HotToastService,
	) {
		this.FormGroup = this._formBuilder.group({
			reason: ['', [Validators.required, Validators.minLength(10)]],
		});
	}

	public handleClose(): void {
		this._dialogRef.close();
	}

	public handleSubmit(): void {
		this.HasErrors = !this.FormGroup.valid;
		if (this.HasErrors) return;

		this._dialogRef.close(this.FormGroup.get('reason').value);
		this._toast.success('Ton signalement a bien été pris en compte', { position: 'bottom-center' });
	}
}
