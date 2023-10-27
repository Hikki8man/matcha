import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewersComponent } from './profile-viewers.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		ProfileViewersComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		ProfileViewersComponent
	]
})
export class ProfileViewersModule { }
