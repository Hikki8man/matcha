import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { MessageInputComponent } from './message-input.component';



@NgModule({
	declarations: [
		MessageInputComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SvgIconComponentModule
	],
	exports: [
		MessageInputComponent
	]
})
export class MessageInputModule { }
