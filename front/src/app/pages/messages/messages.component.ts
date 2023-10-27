import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  public SelectedChatId: number | null = null;

  public handleChatSelectionChange(chatId: number): void {
    this.SelectedChatId = chatId;
  }
}
