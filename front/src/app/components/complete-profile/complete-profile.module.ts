import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CompleteProfileNameComponent } from './complete-profile-name.component';
import { CompleteProfileGenderComponent } from './complete-profile-gender.component';
import { CompleteProfileAvatarComponent } from './complete-profile-avatar.component';
import { CompleteProfileBioComponent } from './complete-profile-bio.component';
import { CompleteProfileTagsComponent } from './complete-profile-tags.component';
import { InterestTagModule } from '../interest-tag/interest-tag.module';

@NgModule({
    declarations: [
        CompleteProfileNameComponent,
        CompleteProfileGenderComponent,
        CompleteProfileAvatarComponent,
        CompleteProfileBioComponent,
        CompleteProfileTagsComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, InterestTagModule],
})
export class CompleteProfileModule {}
