import { NgModule } from '@angular/core';

import { DwToolsRoutingModule } from '@webdpt/components';
import { SharedModule } from './shared/shared.module';
import { DwCmsRoutingModule } from '@webdpt/programs';

@NgModule({
  imports: [
    SharedModule, // 專案的共享模組
    DwToolsRoutingModule, // 平台組件的預設路由模組
    // ---------------------------------------------------------
    // | 選配
    // ---------------------------------------------------------
    // DwCmsRoutingModule // 平台作業路由
  ]
})
export class ToolsRoutingWrapper { }
