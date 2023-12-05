import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActionsMenuComponent } from './user-actions-menu.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		UserActionsMenuComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		UserActionsMenuComponent
	]
})
export class UserActionsMenuModule { }
