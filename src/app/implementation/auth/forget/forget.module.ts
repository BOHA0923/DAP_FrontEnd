import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ForgetRoutingModule } from './forget-routing.module';
import { ForgetComponent } from './forget.component';


@NgModule({
  imports: [
    CommonModule,
    ForgetRoutingModule,
    SharedModule
  ],
  declarations: [
    ForgetComponent
  ]
})
export class ForgetModule { }
