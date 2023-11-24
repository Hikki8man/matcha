import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikeButtonComponent } from './like-button.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
	declarations: [
		LikeButtonComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
	],
	exports: [
		LikeButtonComponent
	]
})
export class LikeButtonComponentModule { }
