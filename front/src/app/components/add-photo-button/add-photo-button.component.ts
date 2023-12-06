import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
	selector: 'add-photo-button',
	templateUrl: './add-photo-button.component.html',
	styleUrls: ['./add-photo-button.component.scss']
})
export class AddPhotoButtonComponent {

	@Input() public Index: number = 0;

	@Output() public OnPhotoAdded: EventEmitter<{ path: string, type: string }> = new EventEmitter<{ path: string, type: string }>();

	public IconAddUrl: string = IconUrlEnum.Add;
	public IconAddStyle: Record<string, string> = {
		width: '50%',
		height: '50%',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
	};

	constructor(
		private readonly _apiService: IApiService,
	) { }

	public handleSubmit(event: any): void {
		if (event.target.files.length === 0) {
			return;
		}
		const reader = new FileReader();
		const file = event.target.files[0];

		reader.onload = (e: any) => {
			this.OnPhotoAdded.emit({ path: e.target.result, type: `photo_${this.Index}` });
		};
		reader.readAsDataURL(file);

		const formData: FormData = new FormData();
		formData.append('photo', file, file.name);
		formData.append('photo_type', `photo_${this.Index}`);
		this._apiService.callApi('profile/edit/photo', 'POST', formData).subscribe((response: any) => {
			console.log(response);
		});
	}
}
