import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListItemComponent } from './notifications-list-item.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		NotificationsListItemComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		NotificationsListItemComponent
	]
})
export class NotificationsListItemModule { }
