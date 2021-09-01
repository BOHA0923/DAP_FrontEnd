import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { SbepQueryModalService } from './service/sbep-query-modal.service';
import { SbepQueryWinComponent } from './sbep-query-win/sbep-query-win.component';
import { SbepQueryInputComponent } from './sbep-query-input/sbep-query-input.component';



@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule
  ],
  declarations: [SbepQueryInputComponent, SbepQueryWinComponent],
  entryComponents: [ // 所有要 [ 動態 ] 加載的組件, 都需要在[entryComponents]模塊部分進行聲明。
    SbepQueryWinComponent
  ],
  exports: [
    SbepQueryInputComponent
  ],
  providers: [
    SbepQueryModalService
  ]
})
export class SbepQueryModule { }
