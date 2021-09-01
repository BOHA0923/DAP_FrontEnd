import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { GroupComponent } from './group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupViewComponent } from './group-view/group-view.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { DwLanguageService } from '@webdpt/framework/language';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: GroupComponent,
    data: {
      dwRouteData: {
        programId: 'dw-group'
      }
    },
    resolve: {
      transaction: DwLanguageService
    },
    children: [
      {
        path: '',
        component: GroupListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-group'
          }
        }
      },
      {
        path: 'dw-group-add',
        component: GroupAddComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-group-add'
          }
        }
      },
      {
        path: 'dw-group-view',
        component: GroupViewComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'dw-group-view'
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
export class GroupRoutingModule { }
