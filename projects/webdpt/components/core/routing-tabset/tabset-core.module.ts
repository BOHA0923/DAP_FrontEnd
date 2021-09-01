import { ModuleWithProviders, NgModule } from '@angular/core';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DwTabInfoService2, DwTabRouteConfigService, DwTabRoutingService} from '@webdpt/framework/routing-tabset';
import {DW_USING_TAB} from '@webdpt/framework/config';
import {DwTabRouteReuseService2} from './service/dw-tab-route-reuse.service2';
import {DwDefaultRouteReuseStrategy} from './service/dw-default-route-reuse.service';

export function usingRouteReuseStrategy2(
  usingTab: boolean,
  tabRouteReuseService: DwTabRouteReuseService2,
  defaultRouteReuseService: DwDefaultRouteReuseStrategy): any {
  if (usingTab) {
    return tabRouteReuseService;
  }
  return defaultRouteReuseService;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  // providers: [
  //   // 作業啟動模式-頁籤
  //   DwTabRouteConfigService,
  //   DwTabInfoService2,
  //   DwTabRouteReuseService2,
  //   DwDefaultRouteReuseStrategy,
  //   DwTabRoutingService,
  //   {
  //     provide: RouteReuseStrategy,
  //     useFactory: usingRouteReuseStrategy2,
  //     deps: [DW_USING_TAB, DwTabRouteReuseService2]
  //   }
  // ]
})
export class DwRoutingTabSetCoreModule {
  static forRoot(): ModuleWithProviders<DwRoutingTabSetCoreModule> {
    return {
      ngModule: DwRoutingTabSetCoreModule,
      providers: [
        DwTabRouteReuseService2,
        {
          provide: RouteReuseStrategy,
          useFactory: usingRouteReuseStrategy2,
          deps: [DW_USING_TAB, DwTabRouteReuseService2]
        }
      ]
    };
  }
}
