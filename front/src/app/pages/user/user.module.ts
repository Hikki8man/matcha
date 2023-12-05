import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserProfileCardModule } from 'src/app/components/user-profile-card/user-profile-card.module';
import { UserPhotosModule } from 'src/app/components/user-photos/user-photos.module';
import { UserAboutModule } from 'src/app/components/user-about/user-about.module';
import { RouterModule } from '@angular/router';
import { UserProfileHeaderModule } from 'src/app/components/user-profile-header/user-profile-header.module';



@NgModule({
	declarations: [
		UserComponent
	],
	imports: [
		CommonModule,
		UserProfileCardModule,
		UserPhotosModule,
		UserAboutModule,
		RouterModule,
		UserProfileHeaderModule,
	],
	exports: [
		UserComponent
	]
})
export class UserModule { }
