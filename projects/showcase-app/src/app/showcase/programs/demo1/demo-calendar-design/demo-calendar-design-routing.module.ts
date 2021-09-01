import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DemoCalendarDesignComponent } from './demo-calendar-design.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DemoCalendarDesignComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-demo-calendar-design',
        // dwAuthId: 'dw-demo-calendar-design'
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
export class DemoCalendarDesignRoutingModule { }
