import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';

@NgModule({
    declarations: [RegisterComponent],
    imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterModule {}
