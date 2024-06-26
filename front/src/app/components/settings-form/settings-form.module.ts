import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsFormComponent } from './settings-form.component';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { MatchaTextAreaModule } from '../matcha-textarea/matcha-textarea.module';
import { UserPhotosModule } from '../user-photos/user-photos.module';
import { SelectTagsButtonModule } from '../select-tags-button/select-tags-button.module';
import { InterestTagsListModule } from '../interest-tags-list/interest-tags-list.module';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { SelectTagsModalModule } from '../select-tags-modal/select-tags-modal.module';
import { MatRippleModule } from '@angular/material/core';
import { LocationModalModule } from '../location-modal/location-modal.module';
import { AvatarEditModule } from '../avatar-edit/avatar-edit.module';
import { ButtonChoicesModule } from '../button-choices/button-choices.module';
import { ValidateButtonModule } from '../validate-button/validate-button.module';



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
		MatchaButtonModule,
		SvgIconComponentModule,
		SelectTagsModalModule,
		MatRippleModule,
		LocationModalModule,
		AvatarEditModule,
		ButtonChoicesModule,
		ValidateButtonModule,
	],
	exports: [
		SettingsFormComponent
	]
})
export class SettingsFormComponentModule { }
