import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { MessageInputModule } from '../message-input/message-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { UserActionsMenuButtonModule } from '../user-actions-menu-button/user-actions-menu-button.module';

@NgModule({
    declarations: [ChatComponent],
    imports: [
        CommonModule,
        MessageInputModule,
        SvgIconComponentModule,
        UserActionsMenuButtonModule,
    ],
    exports: [ChatComponent],
})
export class ChatModule {}
