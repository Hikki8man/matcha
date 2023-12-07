import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list.component';
import { NotificationsListItemModule } from '../notifications-list-item/notifications-list-item.module';



@NgModule({
	declarations: [
		NotificationsListComponent
	],
	imports: [
		CommonModule,
		NotificationsListItemModule,
	],
	exports: [
		NotificationsListComponent
	]
})
export class NotificationsListModule { }
