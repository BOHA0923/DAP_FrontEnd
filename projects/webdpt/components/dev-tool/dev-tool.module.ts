import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwDevToolRoutingModule } from './dev-tool-routing.module';
import { DwUploadCcModule } from './dw-upload-cc/dw-upload-cc.module';

/**
 * 後台「內容管理系統 (Content Management System)」
 */
@NgModule({
  imports: [
    CommonModule,
    DwDevToolRoutingModule,
    DwUploadCcModule
  ],
  declarations: [],
  exports: [
    DwDevToolRoutingModule,
    DwUploadCcModule
  ]
})
export class DwDevToolModule {}
