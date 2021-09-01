import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';

import { GridsterRoutingModule } from './gridster-routing.module';
import { GridsterComponent } from './gridster.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';



const COMPONENTS = [
  GridsterComponent
];

const PROVIDERS = [
];

@NgModule({
  imports: [
    CommonModule,
    GridsterRoutingModule,
    ShowcaseSharedModule,
    GridsterModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class ShowcaseGridsterModule { }
