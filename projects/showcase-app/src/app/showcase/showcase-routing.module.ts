import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MODULE_ROUTES } from '../routes';
import { DwLayoutDefaultComponent } from '@webdpt/components/layout';
import { DwSsoLoginComponent } from '@webdpt/components/sso-login';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: LayoutComponent,
    children: [
      ...MODULE_ROUTES
    ],
    data: {
      tabSetHosting: true
    }
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: (): Promise<any> => import('./auth/login.module').then(m => m.ShowcaseLoginModule)
  },
  {
    path: 'forget',
    pathMatch: 'full',
    loadChildren: (): Promise<any> => import('./auth/forget/forget.module').then(m => m.ShowcaseForgetModule)
  },
  {
    path: 'sso-login',
    pathMatch: 'full',
    component: DwSsoLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowcaseRoutingModule { }
