import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { CompleteCriteriasModule } from './complete-criterias/complete-criterias.module';
import { CompleteInfosModule } from './complete-infos/complete-infos.module';
import { CompletePhotosModule } from './complete-photos/complete-photos.module';
import { CompleteProfileComponent } from './complete-profile.component';


@NgModule({
	declarations: [
		CompleteProfileComponent
	],
	imports: [
		CommonModule,
		MatStepperModule,
		CompleteInfosModule,
		SvgIconComponentModule,
		CompletePhotosModule,
		CompleteCriteriasModule,
	],
	exports: [
		CompleteProfileComponent
	]
})
export class CompleteProfileModule { }
