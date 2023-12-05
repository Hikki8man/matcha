import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponentModule } from '../svg-icon/svg-icon.module';
import { MatchaTextAreaComponent } from './matcha-textarea.component';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
    declarations: [MatchaTextAreaComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SvgIconComponentModule, TextFieldModule],
    exports: [MatchaTextAreaComponent],
})
export class MatchaTextAreaModule { }
