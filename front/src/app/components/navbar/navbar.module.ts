import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';



@NgModule({
	declarations: [
		NavbarComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
	],
	exports: [
		NavbarComponent
	]
})
export class NavbarComponentModule { }
