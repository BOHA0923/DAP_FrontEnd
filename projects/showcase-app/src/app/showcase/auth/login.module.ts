import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwGridModule } from 'ng-quicksilver/grid';

import { ShowcaseSharedModule } from '../shared/shared.module';
import { ShowcaseLoginRoutingModule } from './login-routing.module';
import { ShowcaseLoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseLoginRoutingModule,
    ShowcaseSharedModule,
    DwLayoutModule,
    DwGridModule
  ],
  declarations: [
    ShowcaseLoginComponent
  ]
})
export class ShowcaseLoginModule { }
