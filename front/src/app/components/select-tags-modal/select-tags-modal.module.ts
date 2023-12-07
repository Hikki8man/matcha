import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTagsModalComponent } from './select-tags-modal.component';
import { MatRippleModule } from '@angular/material/core';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { InterestTagsSelectorModule } from '../interest-tags-selector/interest-tags-selector.module';
import { MatButtonModule } from '@angular/material/button';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';


@NgModule({
	declarations: [
		SelectTagsModalComponent
	],
	imports: [
		CommonModule,
		MatRippleModule,
		SvgIconComponentModule,
		InterestTagsSelectorModule,
		MatButtonModule,
		MatchaButtonModule,
	],
	exports: [
		SelectTagsModalComponent
	]
})
export class SelectTagsModalModule { }
