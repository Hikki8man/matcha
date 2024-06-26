import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchaButtonModule } from '../matcha-button/matcha-button.module';
import { MatchaTextAreaModule } from '../matcha-textarea/matcha-textarea.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { ReportModalComponent } from './report-modal.component';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
	declarations: [
		ReportModalComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		MatchaButtonModule,
		MatchaTextAreaModule,
		ReactiveFormsModule,
		MatRippleModule,
	],
	exports: [
		ReportModalComponent
	]
})
export class ReportModalModule { }
