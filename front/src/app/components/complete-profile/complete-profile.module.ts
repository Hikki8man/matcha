import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CompleteProfileComponent } from './complete-profile.component';

@NgModule({
    declarations: [CompleteProfileComponent],
    imports: [CommonModule, ReactiveFormsModule],
})
export class CompleteProfileModule {}
