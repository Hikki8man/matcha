import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchaInputComponent } from './matcha-input.component';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';

@NgModule({
    declarations: [MatchaInputComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SvgIconComponentModule],
    exports: [MatchaInputComponent],
})
export class MatchaInputModule {}
