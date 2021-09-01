import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MODULE_ROUTES } from '../routes';
import { DwLayoutDefaultComponent } from '@webdpt/components/layout';
import { DwSsoLoginComponent } from '@webdpt/components/sso-login';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwLayoutDefaultComponent,
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
    loadChildren: (): Promise<any> => import('./auth/login.module').then(m => m.LoginModule)
  },
  {
    path: 'forget',
    pathMatch: 'full',
    loadChildren: (): Promise<any> => import('./auth/forget/forget.module').then(m => m.ForgetModule)
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
export class ImplementationRoutingModule { }
