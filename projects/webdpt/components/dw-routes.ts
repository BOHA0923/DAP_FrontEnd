import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwUploadCcComponent } from '@webdpt/components/dev-tool';
import { DwUploadCcListComponent } from '@webdpt/components/dev-tool';

import { DwExceptionComponent } from '@webdpt/components/exception';
import { DwIframeFinereportComponent } from '@webdpt/components/finereport';
import { DwIframeGeneralComponent } from '@webdpt/components/iframe';
import { DwAuthGuardService } from '@webdpt/framework/auth';

// TODO: 輕量化 DW_ROUTES拆去components
export const DW_ROUTES: Routes = [
  {
    path: 'exception/:type', // 異常狀態訊息頁
    pathMatch: 'prefix',
    component: DwExceptionComponent
  },
  {
    path: 'fr-reports/:programId',
    component: DwIframeFinereportComponent,
    canActivate: [DwAuthGuardService]
  },
  {
    path: 'gen-reports/:programId',
    component: DwIframeGeneralComponent,
    canActivate: [DwAuthGuardService]
  },
  {
    path: 'dev-tool',
    children: [
      {
        path: 'dw-upload-cc', // 開發工具
        pathMatch: 'prefix',
        component: DwUploadCcComponent,
        data: {
          dwRouteData: {
            programId: 'dw-upload-cc'
          }
        },
        children: [
          {
            path: '',
            component: DwUploadCcListComponent,
            canActivate: [DwAuthGuardService]
          }
        ]
      }
    ]
  }
];

export const dwToolsRouterForChild = RouterModule.forChild(DW_ROUTES);

@NgModule({
  imports: [dwToolsRouterForChild],
  exports: [RouterModule]
})
export class DwToolsRoutingModule {}
