import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DwLanguageService } from '@webdpt/framework/language';
import { ShowcaseForgetComponent } from './forget.component';

const routes: Routes = [
  {
    path: '',
    component: ShowcaseForgetComponent,
    pathMatch: 'prefix',
    data: {
      dwRouteData: {
        programId: 'dw-forget'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShowcaseForgetRoutingModule {
}
