import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { UserProfileCardComponent } from './user-profile-card.component';
import { InterestTagModule } from '../interest-tag/interest-tag.module';
import { LikeButtonComponentModule } from '../like-button/like-button.module';



@NgModule({
	declarations: [
		UserProfileCardComponent
	],
	imports: [
		CommonModule,
		SvgIconComponentModule,
		InterestTagModule,
		LikeButtonComponentModule,
	],
	exports: [
		UserProfileCardComponent,
	]
})
export class UserProfileCardModule { }
