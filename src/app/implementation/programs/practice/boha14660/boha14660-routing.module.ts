import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DwLanguageService, DwAuthGuardService } from '@webdpt/framework';
import { BohaListComponent } from './boha-list/boha-list.component';
import { BohaEditComponent } from './boha-edit/boha-edit.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: BohaListComponent,
    data: {
      dwRouteData: {
        programId: 'boha'
      }
    },
    children: [
      {
        path: '',
        component: BohaListComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'boha'
          }
        }
      },
      {
        path: 'edit',
        component: BohaEditComponent,
        canActivate: [DwAuthGuardService],
        data: {
          dwRouteData: {
            dwAuthId: 'edit'
          }
        }
      }
    ]
    ,
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Boha14660RoutingModule { }
