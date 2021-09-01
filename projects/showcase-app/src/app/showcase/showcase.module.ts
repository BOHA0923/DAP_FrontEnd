import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Provider } from '@angular/compiler/src/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  DW_MENU_JSON,
  DW_PROGRAM_JSON,
  DW_TAB_ROUTE_CONFIG_JSON,
  DW_LANGUAGE_JSON
} from '@webdpt/framework/config';
import { DW_PROGRAM_PAGE, DW_PROGRAM_ACTION } from '@webdpt/framework/config';
import { DwHttpApiInterceptor } from '@webdpt/framework/http';
import { ShowcaseRoutingModule } from './showcase-routing.module';
import { ShowcaseSharedModule } from './shared/shared.module';
import { menuJson } from './menu/model/menu.config';
import { programInfoJson } from './program-info/model/program.config';
import { programPageInfoJson } from './program-info/model/program-page.config';
import { programActionInfoJson } from './program-info/model/program-action.config';
import { tabRouteConfigJson } from './tab-route/model/tab-route-config';
import { languageList } from './language/model/language.config';
import { openSelectModalDefault } from './shared/select-modal/default';
import { openOrgTreeModalDefault } from './shared/organize-tree-modal/default';
import { DW_SELECT_MODAL_DEFAULT } from '@webdpt/components/modals/select';
import { DW_ORGTREE_MODAL_DEFAULT } from '@webdpt/framework/organize-tree-core';

import { LayoutComponent } from './layout/layout.component';
import { DwSharedAppModule } from '@webdpt/framework/shared-app';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseRoutingModule,
    ShowcaseSharedModule, // 共享模組
    // DwServiceWorkerModule.forRoot(60 * 60 * 1000, true)
  ],
  declarations: [LayoutComponent],
  providers: []
})
export class ShowcaseModule {
  // constructor(@Optional() @SkipSelf() parentModule: ShowcaseModule) {
  //   if (parentModule) {
  //     throw new Error(
  //       'ShowcaseModule is already loaded. Import it in the Root Module only');
  //   }
  // }

  static forRoot(providers: Provider[]): ModuleWithProviders<ShowcaseModule> {
    return {
      ngModule: ShowcaseModule,
      providers: [
        // ---------------------------------------------------------
        // | 選配
        // ---------------------------------------------------------
        // 靜態設定檔
        { provide: DW_MENU_JSON, useValue: menuJson }, // Menu靜態設定檔
        { provide: DW_LANGUAGE_JSON, useValue: languageList }, // 可用語言清單
        { provide: DW_PROGRAM_JSON, useValue: programInfoJson }, // 作業靜態設定檔
        { provide: DW_PROGRAM_PAGE, useValue: programPageInfoJson }, // 作業子頁面設定檔
        { provide: DW_PROGRAM_ACTION, useValue: programActionInfoJson }, // 作業功能設定檔
        { provide: DW_TAB_ROUTE_CONFIG_JSON, useValue: tabRouteConfigJson }, // 多頁佈局預設開啟作業
        { provide: DW_SELECT_MODAL_DEFAULT, useValue: openSelectModalDefault }, // 開窗服務的共用設定值
        { provide: DW_ORGTREE_MODAL_DEFAULT, useValue: openOrgTreeModalDefault }, // 組織人員樹開窗元件

        // Http API 攔截器
        DwHttpApiInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          // 用來替換api的網址
          // request.url = '/users'; => request.url = 'http://api/users';
          useExisting: DwHttpApiInterceptor,
          multi: true
        },
        // 業務中台應用 ex.改成動態設定DW_APP_AUTH_TOKEN，同時要拿掉SystemModule的DW_APP_AUTH_TOKEN
        // ...DwSharedAppModule.forRoot().providers,

        ...providers
      ]
    };
  }
}
