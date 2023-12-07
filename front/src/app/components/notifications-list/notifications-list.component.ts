import { Component } from '@angular/core';

@Component({
  selector: 'notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent {

	public Notifications: any[] = [1,2,3,4];
}
