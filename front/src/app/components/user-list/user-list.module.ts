import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InterestTagsListModule } from '../interest-tags-list/interest-tags-list.module';
import { UserListComponent } from './user-list.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { PaginationModule } from '../pagination/pagination.module';

@NgModule({
    declarations: [UserListComponent],
    imports: [
        CommonModule,
        RouterModule,
        InterestTagsListModule,
        SvgIconComponentModule,
        PaginationModule,
    ],
    exports: [UserListComponent],
})
export class UserListModule {}
