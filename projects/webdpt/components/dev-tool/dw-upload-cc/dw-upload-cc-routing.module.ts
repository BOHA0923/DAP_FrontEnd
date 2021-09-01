import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwUploadCcComponent } from './dw-upload-cc.component';
import { DwUploadCcListComponent } from './dw-upload-cc-list/dw-upload-cc-list.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';

const routes: Routes = [
  {
    path: '',
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
export const dwUploadCCRouteForChild = RouterModule.forChild(routes);

@NgModule({
  imports: [dwUploadCCRouteForChild],
  exports: [RouterModule]
})
export class DwUploadCcRoutingModule { }
