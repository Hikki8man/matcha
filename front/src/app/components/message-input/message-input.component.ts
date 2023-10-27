import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'message-input',
	templateUrl: './message-input.component.html',
	styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {

	public Value: string = '';

	@Output() public OnMessageSent: EventEmitter<string> = new EventEmitter<string>();

	public sendMessage(): void {
		if (this.Value.trim().length > 0) {
			this.OnMessageSent.emit(this.Value);
			this.Value = '';
		}
	}
}
