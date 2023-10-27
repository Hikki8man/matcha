import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { ChatsListModule } from 'src/app/components/chats-list/chats-list.module';
import { ChatModule } from 'src/app/components/chat/chat.module';



@NgModule({
	declarations: [
		MessagesComponent
	],
	imports: [
		CommonModule,
		ChatsListModule,
		ChatModule,
	],
	exports: [
		MessagesComponent
	]
})
export class MessagesModule { }
