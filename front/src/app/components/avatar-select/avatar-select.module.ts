import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectComponent } from './avatar-select.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		AvatarSelectComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule
	],
	exports: [
		AvatarSelectComponent
	]
})
export class AvatarSelectModule { }
