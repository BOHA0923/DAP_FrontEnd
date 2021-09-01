import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridsterComponent } from './gridster.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: GridsterComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-gridster'
      }
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GridsterRoutingModule { }
