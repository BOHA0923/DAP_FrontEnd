import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputListwinRoutingModule } from './input-listwin-routing.module';
import { InputListwinComponent } from './input-listwin.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { EnumClientPagingService } from '../../../shared/select-modal/enum/enum-client-paging.service';
import { InputListwinCustomPipe } from './input-listwin-custom.pipe';


const PROVIDERS = [
  DemoOrderServerPagingService,
  MockDataClientPagingService,
  EnumClientPagingService
];


@NgModule({
  imports: [
    CommonModule,
    InputListwinRoutingModule,
    ShowcaseSharedModule
  ],
  declarations: [
    InputListwinComponent,
    InputListwinCustomPipe
  ],
  providers: [
    InputListwinCustomPipe,
    ...PROVIDERS
  ]
})
export class InputListwinModule { }
