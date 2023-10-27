import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsListComponent } from './chats-list.component';



@NgModule({
	declarations: [
		ChatsListComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		ChatsListComponent
	]
})
export class ChatsListModule { }
