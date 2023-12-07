import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTagsButtonComponent } from './select-tags-button.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { MatRippleModule } from '@angular/material/core';
import { SelectTagsModalModule } from '../select-tags-modal/select-tags-modal.module';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
	declarations: [
		SelectTagsButtonComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		MatRippleModule,
		SelectTagsModalModule,
		MatDialogModule,
	],
	exports: [
		SelectTagsButtonComponent
	]
})
export class SelectTagsButtonModule { }
