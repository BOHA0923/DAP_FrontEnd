import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicListwinComponent } from './dynamic-listwin.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DynamicListwinComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-dynamic-listwin',
        dwAuthId: 'dw-dynamic-listwin'
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
export class DynamicListwinRoutingModule { }
