import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { AsisComponent } from './asis.component';
import { AsisListComponent } from './asis-list/asis-list.component';
import { AsisViewComponent } from './asis-view/asis-view.component';
import { AsisAddComponent } from './asis-add/asis-add.component';
import { DwLanguageService } from '@webdpt/framework/language';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: AsisComponent,
    data: {
      dwRouteData: {
        programId: 'dw-asis'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: AsisListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis'
          }
        }
      },
      {
        path: 'dw-asis-add',
        component: AsisAddComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis-add'
          }
        }
      },
      {
        path: 'dw-asis-view',
        component: AsisViewComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-asis-view'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsisRoutingModule { }
