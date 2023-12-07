import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestTagsListComponent } from './interest-tags-list.component';
import { InterestTagModule } from '../interest-tag/interest-tag.module';



@NgModule({
	declarations: [
		InterestTagsListComponent
	],
	imports: [
		CommonModule,
		InterestTagModule,
	],
	exports: [
		InterestTagsListComponent
	]
})
export class InterestTagsListModule { }
