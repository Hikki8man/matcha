import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAboutComponent } from './user-about.component';



@NgModule({
	declarations: [UserAboutComponent],
	imports: [
		CommonModule
	],
	exports: [
		UserAboutComponent
	]
})
export class UserAboutModule { }
