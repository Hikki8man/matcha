import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompleteInfosComponent } from './complete-infos.component';
import { MatchaInputModule } from '../../matcha-input/matcha-input.module';
import { ValidateButtonModule } from '../../validate-button/validate-button.module';
import { MatchaTextAreaModule } from '../../matcha-textarea/matcha-textarea.module';



@NgModule({
	declarations: [
		CompleteInfosComponent
	],
	imports: [
		CommonModule,
		MatchaInputModule,
		ValidateButtonModule,
		MatchaTextAreaModule,
	],
	exports: [
		CompleteInfosComponent
	]
})
export class CompleteInfosModule { }
