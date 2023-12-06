import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InterestTagsListModule } from '../interest-tags-list/interest-tags-list.module';
import { LikeButtonComponentModule } from '../like-button/like-button.module';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { UserProfileCardComponent } from './user-profile-card.component';

@NgModule({
    declarations: [UserProfileCardComponent],
    imports: [
        CommonModule,
        SvgIconComponentModule,
        LikeButtonComponentModule,
        MatTooltipModule,
        InterestTagsListModule,
    ],
    exports: [UserProfileCardComponent],
})
export class UserProfileCardModule {}
