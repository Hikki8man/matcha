import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
	declarations: [
		UserProfileHeaderComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
		MatRippleModule,
	],
	exports: [
		UserProfileHeaderComponent
	]
})
export class UserProfileHeaderModule { }
