import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { SvgIconComponent } from './svg-icon.component';

@NgModule({
  declarations: [
    SvgIconComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    SvgIconComponent,
  ],
})
export class SvgIconComponentModule {}