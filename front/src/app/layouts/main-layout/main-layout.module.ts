import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponentModule } from 'src/app/components/header/header.module';
import { NavbarComponentModule } from 'src/app/components/navbar/navbar.module';
import { FooterModule } from 'src/app/components/footer/footer.module';



@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponentModule,
    NavbarComponentModule,
    FooterModule,
  ],
  exports: [
    MainLayoutComponent,
  ]
})
export class MainLayoutModule { }
