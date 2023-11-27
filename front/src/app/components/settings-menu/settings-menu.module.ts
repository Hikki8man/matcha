import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsMenuComponent } from './settings-menu.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';



@NgModule({
	declarations: [
		SettingsMenuComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
	],
	exports: [
		SettingsMenuComponent
	]
})
export class SettingsMenuComponentModule { }
