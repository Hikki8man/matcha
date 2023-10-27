import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPhotosComponent } from './user-photos.component';
import { LightboxModule } from 'ngx-lightbox';



@NgModule({
	declarations: [
		UserPhotosComponent
	],
	imports: [
		CommonModule,
		LightboxModule
	],
	exports: [
		UserPhotosComponent
	]
})
export class UserPhotosModule { }
