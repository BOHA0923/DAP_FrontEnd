import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwUploadCcListComponent } from './dw-upload-cc/dw-upload-cc-list/dw-upload-cc-list.component';
import { DwUploadCcComponent } from './dw-upload-cc/dw-upload-cc.component';

const routes: Routes = [
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
];
/**
 * An unhandled exception occurred: Error during template compile of 'DwDevToolRoutingModule'
 * Function calls are not supported in decorators but 'RouterModule' was called.
 * 參考它的作法：https://github.com/angular/angular/issues/23609#issuecomment-510871378
 */
export const devToolRouteForChild = RouterModule.forChild(routes);

@NgModule({
  imports: [
    devToolRouteForChild
  ],
  exports: []
})
export class DwDevToolRoutingModule { }
