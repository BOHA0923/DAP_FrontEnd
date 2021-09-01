import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { systemConfigValue } from '@webdpt/framework/config';
import { APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_DMC_USER_INFO_KEY } from '@webdpt/framework/config';
import { DW_DMC_USERINFO } from '@webdpt/framework/config';
import { DwHttpModule } from '@webdpt/framework/http';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: DW_DMC_USERINFO,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_DMC_USER_INFO_KEY]
    }
  ],
  exports: [
    DwHttpModule
  ]
})
export class DwDmcModule { }
