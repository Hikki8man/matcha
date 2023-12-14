import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletePhotosComponent } from './complete-photos.component';
import { UserPhotosModule } from '../../user-photos/user-photos.module';
import { AvatarSelectModule } from '../../avatar-select/avatar-select.module';
import { AvatarEditModule } from '../../avatar-edit/avatar-edit.module';
import { MatchaButtonModule } from '../../matcha-button/matcha-button.module';



@NgModule({
	declarations: [
		CompletePhotosComponent
	],
	imports: [
		CommonModule,
		UserPhotosModule,
		AvatarSelectModule,
		AvatarEditModule,
		MatchaButtonModule,
	],
	exports: [
		CompletePhotosComponent
	]
})
export class CompletePhotosModule { }
