import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShowcaseLoginComponent } from './login/login.component';
import { DwLanguageService } from '@webdpt/framework/language';

const routes: Routes = [
  {
    path: '',
    component: ShowcaseLoginComponent,
    pathMatch: 'prefix',
    data: {
      dwRouteData: {
        programId: 'dw-login'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },
  // {
  //   path: 'forgot',
  //   component: ForgotComponent
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ShowcaseLoginRoutingModule {
}
