import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'user-photo',
	templateUrl: './user-photo.component.html',
	styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent implements AfterViewChecked {

	@Input() public Src: string;
	@Input() public IsEdit: boolean = false;

	@Output() public OnPhotoClicked: EventEmitter<void> = new EventEmitter<void>();
	@Output() public OnEditClicked: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('photo') private _elementRef: ElementRef;

	public OverlayStyle: Record<string, string> = {};
	public IconEditUrl: string = IconUrlEnum.Edit;
	public IconStyle: Record<string, string> = {};

	constructor() {
	}

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
		console.log(event.target.files);
		const reader = new FileReader();

		reader.onload = (e: any) => {
			console.log(e.target.result);
			this.Src = e.target.result;
		};

		reader.readAsDataURL(event.target.files[0]);
	}
}
