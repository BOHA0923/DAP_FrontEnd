import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../shared/shared.module';
import { ShowcaseForgetRoutingModule } from './forget-routing.module';
import { ShowcaseForgetComponent } from './forget.component';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseForgetRoutingModule,
    ShowcaseSharedModule
  ],
  declarations: [
    ShowcaseForgetComponent
  ]
})
export class ShowcaseForgetModule { }
