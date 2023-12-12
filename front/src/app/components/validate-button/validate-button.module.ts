import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateButtonComponent } from './validate-button.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		ValidateButtonComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule
	],
	exports: [
		ValidateButtonComponent
	]
})
export class ValidateButtonModule { }
