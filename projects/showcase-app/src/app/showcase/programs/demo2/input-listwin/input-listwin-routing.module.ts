import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputListwinComponent } from './input-listwin.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: InputListwinComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-input-listwin',
        dwAuthId: 'dw-input-listwin',
        i18n: ['select-modal-demo-order', 'select-modal-mock-data', 'select-modal-enum']
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
export class InputListwinRoutingModule { }
