import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileHeaderComponent } from './user-profile-header.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { UserActionsMenuModule } from '../user-actions-menu/user-actions-menu.module';



@NgModule({
	declarations: [
		UserProfileHeaderComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
		MatRippleModule,
		MatMenuModule,
		UserActionsMenuModule,
	],
	exports: [
		UserProfileHeaderComponent
	]
})
export class UserProfileHeaderModule { }
