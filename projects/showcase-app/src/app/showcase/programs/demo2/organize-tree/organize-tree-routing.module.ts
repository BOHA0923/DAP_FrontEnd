import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';

import { OrganizeTreeComponent } from './organize-tree.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: OrganizeTreeComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-organize-tree',
        dwAuthId: 'dw-organize-tree'
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
export class OrganizeTreeRoutingModule { }
