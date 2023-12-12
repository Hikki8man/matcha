import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
  selector: 'validate-button',
  templateUrl: './validate-button.component.html',
  styleUrls: ['./validate-button.component.scss']
})
export class ValidateButtonComponent {

	@Input() public Disabled: boolean = false;

	@Output() public OnClick: EventEmitter<void> = new EventEmitter<void>();

	public CheckIconUrl: string = IconUrlEnum.Check;
	public IconStyle: Record<string, string> = { display: 'flex', height: '18px', width: '18px' };

	public handleClick(): void {
		this.OnClick.emit();
	}
}
