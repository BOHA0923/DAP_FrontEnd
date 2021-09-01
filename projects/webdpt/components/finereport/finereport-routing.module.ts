import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DwIframeFinereportComponent } from './finereport.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DwIframeFinereportComponent
  }
];

export const DW_IFRAME_FINEREPORT_ROUTES = RouterModule.forChild(routes);

@NgModule({
  imports: [DW_IFRAME_FINEREPORT_ROUTES],
  exports: [RouterModule]
})
export class DwIframeFinereportRoutingModule { }
