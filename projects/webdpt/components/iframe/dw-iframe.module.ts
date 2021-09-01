import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DwBaseIframeModule } from './base-iframe/dw-base-iframe.module';
import { DwIframeGeneralModule } from './general/general.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
    DwBaseIframeModule,
    DwIframeGeneralModule
  ]
})
export class DwIframeModule {}
