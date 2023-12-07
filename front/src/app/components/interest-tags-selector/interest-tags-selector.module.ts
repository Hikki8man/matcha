import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InterestTagModule } from '../interest-tag/interest-tag.module';
import { InterestTagsListModule } from '../interest-tags-list/interest-tags-list.module';
import { MatchaInputModule } from '../matcha-input/matcha-input.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { InterestTagsSelectorComponent } from './interest-tags-selector.component';



@NgModule({
	declarations: [
		InterestTagsSelectorComponent
	],
	imports: [
		CommonModule,
		MatchaInputModule,
		InterestTagModule,
		InterestTagsListModule,
		SvgIconComponentModule,
	],
	exports: [
		InterestTagsSelectorComponent
	]
})
export class InterestTagsSelectorModule { }
