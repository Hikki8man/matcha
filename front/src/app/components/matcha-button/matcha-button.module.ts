import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { MatchaButtonComponent } from './matcha-button.component';

@NgModule({
    declarations: [MatchaButtonComponent],
    imports: [CommonModule, ReactiveFormsModule, SvgIconComponentModule],
    exports: [MatchaButtonComponent],
})
export class MatchaButtonModule {}
