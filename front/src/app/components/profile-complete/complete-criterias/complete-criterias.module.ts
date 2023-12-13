import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InterestTagsSelectorModule } from '../../interest-tags-selector/interest-tags-selector.module';
import { CompleteCriteriasComponent } from './complete-criterias.component';
import { MatchaButtonModule } from '../../matcha-button/matcha-button.module';



@NgModule({
	declarations: [
		CompleteCriteriasComponent
	],
	imports: [
		CommonModule,
		InterestTagsSelectorModule,
		MatchaButtonModule,
	],
	exports: [
		CompleteCriteriasComponent
	]
})
export class CompleteCriteriasModule { }
