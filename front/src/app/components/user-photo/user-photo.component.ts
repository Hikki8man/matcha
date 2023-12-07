import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';
import { IApiService } from 'src/app/services/api/iapi.service';

@Component({
	selector: 'user-photo',
	templateUrl: './user-photo.component.html',
	styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent implements AfterViewChecked {

	@Input() public Src: string;
	@Input() public IsEdit: boolean = false;
	@Input() public Index: number = 0;

	@Output() public OnPhotoClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public OnEditClicked: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('photo') private _elementRef: ElementRef;

	public OverlayStyle: Record<string, string> = {};
	public IconEditUrl: string = IconUrlEnum.Edit;
	public IconStyle: Record<string, string> = {};

	constructor(
		private readonly _apiService: IApiService,
		private readonly _toast: HotToastService
	) { }

	@HostListener('window:resize', ['$event'])
	public handleResize() {
		this.updateOverlayStyle();
	}

	ngAfterViewChecked(): void {
		this.updateOverlayStyle();
	}

	private updateOverlayStyle(): void {
		const element = this._elementRef.nativeElement as HTMLElement;
		this.OverlayStyle = {
			width: element.offsetWidth + 'px',
			height: element.offsetHeight + 'px',
		};
		this.IconStyle = {
			width: element.offsetWidth / 2 + 'px',
			height: element.offsetHeight / 2 + 'px',
			position: 'absolute',
			transform: 'translate(50%, 50%)',
		};
	}

	public handleSubmit(event: any): void {
		if (event.target.files.length === 0) {
			return;
		}
		const reader = new FileReader();
		const file = event.target.files[0];

		let src: string;

		reader.onload = (e: any) => {
			src = e.target.result;
		};
		reader.readAsDataURL(file);

		const formData: FormData = new FormData();
		formData.append('photo', file, file.name);
		formData.append('photo_type', `photo_${this.Index}`);
		this._apiService.callApi('profile/edit/photo', 'POST', formData)
			.subscribe({
				complete: () => {
					this.Src = src
				},
				error: (err) => {
					this._toast.error('Erreur lors de l\'envoi de la photo', { position: 'bottom-center' });
					throw err;
				},
			});
	}
}
