import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwHomeSettingComponent } from './dw-home-setting/dw-home-setting.component';
import { DwHomeSettingListComponent } from './dw-home-setting/dw-home-setting-list/dw-home-setting-list.component';
import { DwSysMenuComponent } from './dw-sys-menu/dw-sys-menu.component';
import { DwSysMenuListComponent } from './dw-sys-menu/dw-sys-menu-list/dw-sys-menu-list.component';
import { DwScheduleResultComponent } from './dw-schedule-result/dw-schedule-result.component';
import { DwScheduleResultListComponent } from './dw-schedule-result/dw-schedule-result-list/dw-schedule-result-list.component';
import { DwCmsModule } from './cms.module';

const routes: Routes = [
  {
    path: 'cms/dw-home-setting',
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: DwHomeSettingComponent,
        data: {
          dwRouteData: {
            programId: 'dw-home-setting'
          }
        },
        children: [
          {
            path: '',
            component: DwHomeSettingListComponent,
            canActivate: [DwAuthGuardService],
            data: {
              dwRouteData: {
                dwAuthId: 'dw-home-setting'
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: 'cms/dw-sys-menu',
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: DwSysMenuComponent,
        data: {
          dwRouteData: {
            programId: 'dw-sys-menu'
          }
        },
        // resolve: {
        //   transaction: DwLanguageService // 平台作業多語言在framework載入
        // },
        children: [
          {
            path: '',
            component: DwSysMenuListComponent,
            canActivate: [DwAuthGuardService],
            data: {
              dwRouteData: {
                dwAuthId: 'dw-sys-menu'
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: 'cms/dw-schedule-result',
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        component: DwScheduleResultComponent,
        data: {
          dwRouteData: {
            programId: 'dw-schedule-result'
          }
        },
        // resolve: {
        //   transaction: DwLanguageService // 平台作業多語言在framework載入
        // },
        children: [
          {
            path: '',
            component: DwScheduleResultListComponent,
            canActivate: [DwAuthGuardService],
            data: {
              dwRouteData: {
                dwAuthId: 'dw-schedule-result'
              }
            }
          }
        ]
      }
    ]
  }
];

export const DW_CMS_ROUTES = RouterModule.forChild(routes);

@NgModule({
  imports: [
    DW_CMS_ROUTES,
    DwCmsModule
  ],
  exports: [RouterModule]
})
export class DwCmsRoutingModule { }
