import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DwIframeGeneralComponent } from './general.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwIframeGeneralComponent
  }
];

export const DW_IFRAME_GENERAL_ROUTES = RouterModule.forChild(routes);

@NgModule({
  imports: [DW_IFRAME_GENERAL_ROUTES],
  exports: [RouterModule]
})
export class DwIframeGeneralRoutingModule { }
