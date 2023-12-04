import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

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

	constructor() {
	}

	ngAfterViewChecked(): void {
		const element = this._elementRef.nativeElement as HTMLElement;
		this.OverlayStyle = {
			width: element.offsetWidth + 'px',
			height: element.offsetHeight + 'px',
		};
	}
}
