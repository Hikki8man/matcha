import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';



@NgModule({
	declarations: [
		SearchBarComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		FormsModule,
	],
	exports: [
		SearchBarComponent,
	]
})
export class SearchBarComponentModule { }
