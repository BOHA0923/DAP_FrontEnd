import {
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwCmcModule } from '@webdpt/framework/cmc';
import { DwDmcModule } from '@webdpt/framework/dmc';
import { DwEmcModule } from '@webdpt/framework/emc';

import { DwAuthModule } from '@webdpt/framework/auth';
import { DwOperationModule } from '@webdpt/framework/operation';
import { DwProgramInfoModule } from '@webdpt/framework/program-info';
import { DwDefaultAppModule } from '@webdpt/framework/program-info';
import { DwAppTitleModule } from '@webdpt/framework/app-title';
import { DwErrorHandlerModule } from '@webdpt/framework/errors';
import { DwStorageModule } from '@webdpt/framework/storage';
import { DwSystemConfigModule } from '@webdpt/framework/config';
import { DwLanguageI18nModule } from '@webdpt/framework/language';
import { APP_SYSTEM_CONFIG } from '@webdpt/framework/config';
import { DwAccountModule } from '@webdpt/framework/account';
import { DwOrganizeTreeCoreModule } from '@webdpt/framework/organize-tree-core';
import { TranslateModule } from '@ngx-translate/core';
import { DwUserModule } from '@webdpt/framework/user';
import { DwIframeCoreModule } from '@webdpt/framework/iframe-core';
import { DwFinereportCoreModule } from '@webdpt/framework/finereport-core';
import { DwOmModule } from '@webdpt/framework/om';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
    DwAppTitleModule,
    DwAuthModule,
    DwProgramInfoModule,
    DwDefaultAppModule,
    DwErrorHandlerModule,
    DwStorageModule,
    DwSystemConfigModule,
    DwLanguageI18nModule,
    DwAccountModule,
    DwOrganizeTreeCoreModule,
    DwDmcModule,
    DwEmcModule,
    DwUserModule,
    DwOperationModule,
    DwIframeCoreModule,
    DwFinereportCoreModule,
    DwCmcModule,
    DwOmModule
  ]
})
export class FrameworkModule {
  constructor(@Optional() @SkipSelf() parentModule: FrameworkModule) {
    if (parentModule) {
      throw new Error(
        'FrameworkModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(providers: Provider[], systemConfig?: { [key: string]: any }): ModuleWithProviders<FrameworkModule> {
    return {
      ngModule: FrameworkModule,
      providers: [
        ...TranslateModule.forRoot({
          isolate: true,
          useDefaultLang: false
        }).providers,
        {
          provide: APP_SYSTEM_CONFIG,
          useValue: systemConfig
        },
        ...providers
      ]
    };
  }

}
