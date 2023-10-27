import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchBarComponentModule } from '../search-bar/search-bar.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { HeaderComponent } from './header.component';



@NgModule({
	declarations: [
		HeaderComponent
	],
	imports: [
		CommonModule,
		SearchBarComponentModule,
		SvgIconComponentModule,
	],
	exports: [
		HeaderComponent,
	]
})
export class HeaderComponentModule { }
