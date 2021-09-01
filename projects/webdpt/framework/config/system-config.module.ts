import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  APP_DATE_FORMAT,
  APP_DEFAULT,
  APP_SYSTEM_CONFIG,
  APP_TIME_FORMAT,
  DW_APP_AUTH_TOKEN,
  DW_APP_ID,
  DW_APP_TYPE,
  DW_DMC_USERINFO,
  DW_LOAD_MASK_DELAY,
  DW_LOAD_MASK_HTTP,
  DW_TAB_MULTI_OPEN,
  DW_USING_TAB,
  Logo_Path,
  LONIG_DEFAULT,
  DW_SYSTEM_CONFIG,
  DW_SYSTEM_CONFIG_APP_ID_KEY,
  DW_SYSTEM_CONFIG_DEFAULT_APP_KEY,
  DW_SYSTEM_CONFIG_LOGO_PATH_KEY,
  DW_SYSTEM_CONFIG_DATE_FORMAT_KEY,
  DW_SYSTEM_CONFIG_TIME_FORMAT_KEY,
  DW_SYSTEM_CONFIG_USING_TAB_KEY,
  DW_SYSTEM_CONFIG_TAB_MULTI_OPEN_KEY,
  DW_SYSTEM_CONFIG_DEFAULT_LOGIN_KEY,
  DW_SYSTEM_CONFIG_APP_AUTH_TOKEN_KEY,
  DW_SYSTEM_CONFIG_LOAD_MASK_HTTP_KEY,
  DW_SYSTEM_CONFIG_LOAD_MASK_DELAY_KEY, DW_SYSTEM_CONFIG_DMC_USER_INFO_KEY, DW_TAB_STORE_STRATEGY, DW_SYSTEM_CONFIG_TAB_STORE_STRATEGY_KEY
} from './system.config';
import {DwSystemConfigInitializer, initStore} from './system-config.initializer';
import {DwSystemConfigService} from './config.service';

export function systemConfigValue(systemConfig: { [key: string]: any }, key: string): any {
  return (systemConfig && systemConfig[key]) ? systemConfig[key] : DW_SYSTEM_CONFIG[key];
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DwSystemConfigService,
    DwSystemConfigInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: initStore,
      deps: [DwSystemConfigInitializer],
      multi: true
    },
    {
      provide: DW_APP_TYPE,
      useValue: ''
    },
    {
      provide: DW_APP_ID,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_APP_ID_KEY]
    },
    {
      provide: APP_DEFAULT,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_DEFAULT_APP_KEY]
    },
    {
      provide: Logo_Path,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_LOGO_PATH_KEY]
    },
    {
      provide: APP_DATE_FORMAT,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_DATE_FORMAT_KEY]
    },
    {
      provide: APP_TIME_FORMAT,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_TIME_FORMAT_KEY]
    },
    {
      provide: DW_USING_TAB,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_USING_TAB_KEY]
    },
    {
      provide: DW_TAB_MULTI_OPEN,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_TAB_MULTI_OPEN_KEY]
    },
    {
      provide: LONIG_DEFAULT,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_DEFAULT_LOGIN_KEY]
    },
    {
      provide: DW_APP_AUTH_TOKEN,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_APP_AUTH_TOKEN_KEY]
    },
    {
      provide: DW_LOAD_MASK_HTTP,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_LOAD_MASK_HTTP_KEY]
    },
    {
      provide: DW_LOAD_MASK_DELAY,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_LOAD_MASK_DELAY_KEY]
    },
    {
      provide: DW_TAB_STORE_STRATEGY,
      useFactory: systemConfigValue,
      deps: [APP_SYSTEM_CONFIG, DW_SYSTEM_CONFIG_TAB_STORE_STRATEGY_KEY]
    }
  ]
})
export class DwSystemConfigModule {
}
