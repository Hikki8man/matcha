import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsFormComponentModule } from 'src/app/components/settings-form/settings-form.module';



@NgModule({
	declarations: [
		SettingsComponent
	],
	imports: [
		CommonModule,
		SettingsFormComponentModule,
	],
	exports: [
		SettingsComponent
	]
})
export class SettingsModule { }
