import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPhotoButtonComponent } from './add-photo-button.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		AddPhotoButtonComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		AddPhotoButtonComponent
	]
})
export class AddPhotoButtonModule { }
