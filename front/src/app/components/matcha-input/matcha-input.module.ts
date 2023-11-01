import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchaInputComponent } from './matcha-input.component';

@NgModule({
    declarations: [MatchaInputComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [MatchaInputComponent],
})
export class MatchaInputModule {}
