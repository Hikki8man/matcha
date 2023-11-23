import { Component, HostListener, OnInit } from '@angular/core';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
	public SelectedChatId: number | null = null;
	public IsMobileView: boolean = false;

	ngOnInit(): void {
		this.IsMobileView = window.innerWidth <= 600;
	}

	@HostListener('window:resize', ['$event'])
	public handleResize(event: any) {
		this.IsMobileView = event.target.innerWidth <= 600;
	}

	public handleChatSelectionChange(chatId: number): void {
		this.SelectedChatId = chatId;
	}

	public handleBackArrowClick(): void {
		this.SelectedChatId = null;
	}
}
