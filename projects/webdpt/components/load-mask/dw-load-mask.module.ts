import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwDivMaskComponent } from './dw-load-mask.component';
import { DwLoadMaskService } from './dw-load-mask.service';
import { DwLoadMaskOptionsService } from './dw-load-mask-options.service';
import { DwHttpLoadMaskService, DwHttpClientOptionsService } from '@webdpt/framework/http';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DwDivMaskComponent
  ],
  exports: [
    DwDivMaskComponent
  ],
  providers: [
    DwLoadMaskService,
    {
      provide: DwHttpLoadMaskService,
      useExisting: DwLoadMaskService
    },
    DwLoadMaskOptionsService,
    {
      provide: DwHttpClientOptionsService,
      useExisting: DwLoadMaskOptionsService
    }
  ]

})
export class DwDivMaskModule { }
