import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwHomeSettingComponent } from './dw-home-setting.component';
import { DwHomeSettingListComponent } from './dw-home-setting-list/dw-home-setting-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwHomeSettingComponent,
    data: {
      dwRouteData: {
        programId: 'dw-home-setting'
      }
    },
    // resolve: {
    //   transaction: DwLanguageService // 平台作業多語言在framework載入
    // },
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
];

export const DW_HOME_SETTING_ROUTES = RouterModule.forChild(routes);

@NgModule({
  imports: [DW_HOME_SETTING_ROUTES],
  exports: [RouterModule]
})
export class DwHomeSettingRoutingModule { }
