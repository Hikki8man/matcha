import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { UserActionsMenuModule } from '../user-actions-menu/user-actions-menu.module';
import { UserActionsMenuButtonComponent } from './user-actions-menu-button.component';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
	declarations: [
		UserActionsMenuButtonComponent
	],
	imports: [
		CommonModule,
		MatMenuModule,
		SvgIconComponentModule,
		UserActionsMenuModule,
		MatRippleModule,
	],
	exports: [
		UserActionsMenuButtonComponent
	]
})
export class UserActionsMenuButtonModule { }
