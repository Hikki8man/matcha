import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPhotoComponent } from './user-photo.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		UserPhotoComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		UserPhotoComponent
	]
})
export class UserPhotoModule { }
