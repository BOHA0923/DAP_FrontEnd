import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DW_APP_TYPE, DW_APP_ID, DW_APP_AUTH_TOKEN } from '@webdpt/framework/config';
import { DwSystemDynamicConfigInitializer } from './system-dynamic-config.initializer';
import {
  DwSystemDynamicConfigAppIdFactory, DwSystemDynamicConfigAppTokenFactory
} from './system-dynamic-config.factory';

/**
 * 業務中台應用
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class DwSharedAppModule {
  static forRoot(): ModuleWithProviders<DwSharedAppModule> {
    return {
      ngModule: DwSharedAppModule,
      providers: [
        {
          provide: DW_APP_TYPE,
          useValue: 'SharedApp' // 業務中台應用
        },
        DwSystemDynamicConfigInitializer, // 環境變數動態設定初始化 ex.業務中台應用的AppToken是SSO時傳入
        {
          provide: DW_APP_ID,
          useFactory: DwSystemDynamicConfigAppIdFactory,
          deps: [DwSystemDynamicConfigInitializer]
        },
        {
          provide: DW_APP_AUTH_TOKEN,
          useFactory: DwSystemDynamicConfigAppTokenFactory,
          deps: [DwSystemDynamicConfigInitializer]
        },
      ]
    };
  }
}
