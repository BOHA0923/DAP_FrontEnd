import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwCmsRoutingModule } from './cms-routing.module';
import { DwHomeSettingModule } from './dw-home-setting/dw-home-setting.module';
import { DwSysMenuModule } from './dw-sys-menu/dw-sys-menu.module';
import { DwScheduleResultModule } from './dw-schedule-result/dw-schedule-result.module';

/**
 * 後台「內容管理系統 (Content Management System)」
 */
@NgModule({
  imports: [
    CommonModule,
    DwHomeSettingModule,
    DwScheduleResultModule
  ],
  declarations: [],
  exports: [
    DwHomeSettingModule,
    DwSysMenuModule,
    DwScheduleResultModule
  ]
})
export class DwCmsModule {}
