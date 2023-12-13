import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarEditComponent } from './avatar-edit.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';



@NgModule({
    declarations: [
        AvatarEditComponent
    ],
    imports: [
        CommonModule,
        SvgIconComponentModule,
    ],
    exports: [
        AvatarEditComponent
    ]
})
export class AvatarEditModule { }
