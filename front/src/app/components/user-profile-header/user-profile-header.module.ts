import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { UserActionsMenuButtonModule } from '../user-actions-menu-button/user-actions-menu-button.module';
import { UserProfileHeaderComponent } from './user-profile-header.component';



@NgModule({
	declarations: [
		UserProfileHeaderComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
		MatRippleModule,
		UserActionsMenuButtonModule,
	],
	exports: [
		UserProfileHeaderComponent
	]
})
export class UserProfileHeaderModule { }
