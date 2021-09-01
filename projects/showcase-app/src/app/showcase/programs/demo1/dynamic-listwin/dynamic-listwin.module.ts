import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicListwinRoutingModule } from './dynamic-listwin-routing.module';
import { DynamicListwinComponent } from './dynamic-listwin.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { SbepQueryModule } from '../../../shared/dynamic-modal/sbep-query/sbep-query.module';


@NgModule({
  imports: [
    CommonModule,
    DynamicListwinRoutingModule,
    ShowcaseSharedModule,
    SbepQueryModule
  ],
  declarations: [DynamicListwinComponent]
})

export class DynamicListwinModule { }
