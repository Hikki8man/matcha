import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageInputComponent } from './message-input.component';
import { FormsModule } from '@angular/forms';



@NgModule({
	declarations: [
		MessageInputComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		MessageInputComponent
	]
})
export class MessageInputModule { }
