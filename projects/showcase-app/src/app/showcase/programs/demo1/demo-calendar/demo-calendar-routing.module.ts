import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DemoCalendarComponent } from './demo-calendar.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DemoCalendarComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-demo-calendar',
        // dwAuthId: 'dw-demo-calendar'
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
export class DemoCalendarRoutingModule { }
