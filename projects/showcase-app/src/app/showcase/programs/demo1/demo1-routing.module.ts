import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dw-order'
  },
  {
    path: 'dw-order',
    loadChildren: (): Promise<any> => import('./order/order.module').then(m => m.OrderModule)
  },
  {
    path: 'dw-document-order',
    loadChildren: (): Promise<any> => import('./document-order/order.module').then(m => m.DocumentOrderModule)
  },
  {
    path: 'dw-group',
    loadChildren: (): Promise<any> => import('./group/group.module').then(m => m.GroupModule)
  },
  {
    path: 'dw-asis',
    loadChildren: (): Promise<any> => import('./asis/asis.module').then(m => m.AsisModule)
  },
  {
    path: 'dw-tree',
    loadChildren: (): Promise<any> => import('./tree/tree.module').then(m => m.ShowcaseTreeModule)
  },
  {
    path: 'dw-gridster',
    loadChildren: (): Promise<any> => import('./gridster/gridster.module').then(m => m.ShowcaseGridsterModule)
  },
  {
    path: 'dw-tree-menu',
    loadChildren: (): Promise<any> => import('./tree-menu/tree-menu.module').then(m => m.TreeMenuModule)
  },
  {
    path: 'dynamic-listwin',
    loadChildren: (): Promise<any> => import('./dynamic-listwin/dynamic-listwin.module').then(m => m.DynamicListwinModule)
  },
  {
    path: 'account-info',
    loadChildren: (): Promise<any> => import('./account-info/account-info.module').then(m => m.AccountInfoModule)
  },
  {
    path: 'dw-demo-calendar',
    loadChildren: (): Promise<any> => import('./demo-calendar/demo-calendar.module').then(m => m.DemoCalendarModule)
  },
  {
    path: 'dw-demo-calendar-design',
    loadChildren: (): Promise<any> => import('./demo-calendar-design/demo-calendar-design.module').then(m => m.DemoCalendarDesignModule)
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Demo1RoutingModule { }
