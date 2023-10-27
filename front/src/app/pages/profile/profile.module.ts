import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAboutModule } from 'src/app/components/user-about/user-about.module';
import { UserPhotosModule } from 'src/app/components/user-photos/user-photos.module';
import { UserProfileCardModule } from 'src/app/components/user-profile-card/user-profile-card.module';
import { ProfileComponent } from './profile.component';
import { ProfileViewersModule } from 'src/app/components/profile-viewers/profile-viewers.module';
import { ProfileLikesModule } from 'src/app/components/profile-likes/profile-likes.module';



@NgModule({
	declarations: [
		ProfileComponent
	],
	imports: [
		CommonModule,
		UserProfileCardModule,
		UserPhotosModule,
		UserAboutModule,
		ProfileViewersModule,
		ProfileLikesModule,
	],
	exports: [
		ProfileComponent
	]
})
export class ProfileModule { }
