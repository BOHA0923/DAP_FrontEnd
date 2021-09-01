import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DwLanguageService, DwAuthGuardService } from '@webdpt/framework';
import { BohaListComponent } from './boha-list/boha-list.component';


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
