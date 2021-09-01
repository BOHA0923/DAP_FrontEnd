import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwLanguageService } from '@webdpt/framework/language';
import { DwDemoImageViewerComponent } from './dw-demo-image-viewer.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwDemoImageViewerComponent,
    // canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-demo-image-viewer'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DwDemoImageViewerRoutingModule { }
