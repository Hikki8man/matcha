import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCompleteComponent } from './profile-complete.component';
import { MatStepperModule } from '@angular/material/stepper';
import { CompleteInfosModule } from './complete-infos/complete-infos.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { CompletePhotosModule } from './complete-photos/complete-photos.module';


@NgModule({
	declarations: [
		ProfileCompleteComponent
	],
	imports: [
		CommonModule,
		MatStepperModule,
		CompleteInfosModule,
		SvgIconComponentModule,
		CompletePhotosModule,
	],
	exports: [
		ProfileCompleteComponent
	]
})
export class ProfileCompleteModule { }
