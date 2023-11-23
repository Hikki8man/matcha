import { Component, EventEmitter, Output } from '@angular/core';
import { IconUrlEnum } from 'src/app/enums/icon-url-enum';

@Component({
	selector: 'message-input',
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

	public Value: string = '';

	public SendIconUrl: string = IconUrlEnum.Send;
	public SendIconStyle: Record<string, string> = { display: 'flex', height: '24px', width: '24px', fill: 'var(--color-text-secondary)' };

	@Output() public OnMessageSent: EventEmitter<string> = new EventEmitter<string>();

	public sendMessage(): void {
		if (this.Value.trim().length > 0) {
			this.OnMessageSent.emit(this.Value);
			this.Value = '';
		}
	}
}
