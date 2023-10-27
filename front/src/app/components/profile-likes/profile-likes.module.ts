import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileLikesComponent } from './profile-likes.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		ProfileLikesComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule
	],
	exports: [
		ProfileLikesComponent
	]
})
export class ProfileLikesModule { }
