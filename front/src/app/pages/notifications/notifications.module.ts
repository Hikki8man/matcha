import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { NotificationsListModule } from 'src/app/components/notifications-list/notifications-list.module';



@NgModule({
	declarations: [
		NotificationsComponent
	],
	imports: [
		CommonModule,
		NotificationsListModule,
	],
	exports: [
		NotificationsComponent
	]
})
export class NotificationsModule { }
