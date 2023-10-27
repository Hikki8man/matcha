import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { NavbarComponentModule } from 'src/app/components/navbar/navbar.module';



@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponentModule,
    NavbarComponentModule,
  ],
  exports: [
    MainLayoutComponent,
  ]
})
export class MainLayoutModule { }
