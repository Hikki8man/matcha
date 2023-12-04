import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPhotosComponent } from './user-photos.component';
import { LightboxModule } from 'ngx-lightbox';
import { UserPhotoModule } from '../user-photo/user-photo.module';



@NgModule({
	declarations: [
		UserPhotosComponent
	],
	imports: [
		CommonModule,
		LightboxModule,
		UserPhotoModule,
	],
	exports: [
		UserPhotosComponent
	]
})
export class UserPhotosModule { }
