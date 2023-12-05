import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsMenuComponent } from './settings-menu.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
	declarations: [
		SettingsMenuComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		RouterModule,
		MatRippleModule,
	],
	exports: [
		SettingsMenuComponent
	]
})
export class SettingsMenuComponentModule { }
