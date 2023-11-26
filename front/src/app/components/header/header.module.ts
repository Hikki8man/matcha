import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchBarComponentModule } from '../search-bar/search-bar.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { HeaderComponent } from './header.component';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsMenuComponentModule } from '../settings-menu/settings-menu.module';


@NgModule({
	declarations: [
		HeaderComponent
	],
	imports: [
		CommonModule,
		SearchBarComponentModule,
		SvgIconComponentModule,
		MatRippleModule,
		MatMenuModule,
		SettingsMenuComponentModule,
	],
	exports: [
		HeaderComponent,
	]
})
export class HeaderComponentModule { }
