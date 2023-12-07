import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsFormComponent } from './settings-form.component';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { MatchaTextAreaModule } from '../matcha-textarea/matcha-textarea.module';
import { UserPhotosModule } from '../user-photos/user-photos.module';
import { SelectTagsButtonModule } from '../select-tags-button/select-tags-button.module';
import { InterestTagsListModule } from '../interest-tags-list/interest-tags-list.module';



@NgModule({
	declarations: [
		SettingsFormComponent
	],
	imports: [
		CommonModule,
		MatchaInputModule,
		MatchaTextAreaModule,
		UserPhotosModule,
		SelectTagsButtonModule,
		InterestTagsListModule,
	],
	exports: [
		SettingsFormComponent
	]
})
export class SettingsFormComponentModule { }
