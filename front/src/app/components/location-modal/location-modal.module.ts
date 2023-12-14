import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationModalComponent } from './location-modal.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		LocationModalComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		LocationModalComponent
	]
})
export class LocationModalModule { }
