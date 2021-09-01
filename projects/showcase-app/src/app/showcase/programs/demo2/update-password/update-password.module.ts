import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { UpdatePasswordRoutingModule } from './update-password-routing.module';
import { UpdatePasswordComponent } from './update-password.component';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    UpdatePasswordRoutingModule
  ],
  declarations: [
    UpdatePasswordComponent
  ]
})
export class UpdatePasswordModule { }
