import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessageInputModule } from '../message-input/message-input.module';



@NgModule({
	declarations: [
		ChatComponent
	],
	imports: [
		CommonModule,
		MessageInputModule
	],
	exports: [
		ChatComponent
	]
})
export class ChatModule { }
